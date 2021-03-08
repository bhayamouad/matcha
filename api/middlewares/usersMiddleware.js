require('dotenv').config()
const axios = require('axios')
const bcrypt = require('bcrypt') 

const auth = require('../tools/authentication.js')

const User = require('../models/User')

exports.authorize = (req, res, next) => auth.authorize(req, res, next)

exports.e42Oauth = (req, res, next) => {
    const code = req.body.code
    axios({
        url: `https://api.intra.42.fr/oauth/token`,
        method: 'post',
        params: {
            grant_type: 'authorization_code',
            code,
            client_id: process.env.CLIENT_42_ID,
            client_secret: process.env.CLIENT_42_KEY,
            redirect_uri: `${process.env.CLIENT_URL}/oauth/42`,
            headers: {'content-type': 'application/x-www-form-urlencoded'}  
        }, 
      }).then(({data})=>{ 
          return axios({
            url: 'https://api.intra.42.fr/v2/me',
            method: 'get',
            headers: {
                Authorization: `Bearer ${data.access_token}`,  
            },
          })      
      }).then(({data})=>{ 
        const {id , email, first_name:fname, last_name:lname} = data
        const userdata = {
          oauth_id: `e42${id}`,
          fname,
          lname,
          email,
          status: 1
        } 
        return userdata; 
    }).then((ret)=>{
      req.userdata = ret
      next() 
  }).catch((e)=> res.status(200).send({error: 'There is an error in 42 API'}))
}

exports.fbOauth = (req, res, next) => {
    const code = req.body.code
    axios({
        url: 'https://graph.facebook.com/v4.0/oauth/access_token',
        method: 'get',
        params: {
          client_id: process.env.CLIENT_FB_ID,
          client_secret: process.env.CLIENT_FB_KEY,
          redirect_uri: `${process.env.CLIENT_URL}/oauth/facebook`,
          code,
        },
      }).then(({data})=>{
          return axios({
            url: 'https://graph.facebook.com/me',
            method: 'get',
            params: {
                fields: ['id', 'email', 'first_name', 'last_name', 'birthday', 'gender'].join(','),
                access_token: data.access_token,
                }
          })        
      }).then(({data})=>{ 
          const {id , email, first_name:fname, last_name:lname, birthday, gender} = data 
          const userdata = {
            oauth_id: `fb${id}`,
            fname,
            lname,
            email,
            gender: (gender === 'male')? 'M':(x ==='female'? 'F':'O'),
            birthdate: new Date(birthday.toString()),
            status: 1
          } 
          return userdata; 
      }).then((ret)=>{
        req.userdata = ret
        next() 
    }).catch((e)=>{ 
        res.status(200).send({error: 'There is an error on Facebook API'})
      })
} 

exports.registerValidation = (req, res, next) => { 
    const { email, login } = req.body;
    User.ifUnique(email, login) 
        .then((ret) => {
            if (ret[0][0][0] || ret[1][0][0]) {
                let emailerr = false
                let loginerr = false
                if (ret[0][0][0])
                    emailerr = true;
                if (ret[1][0][0])
                    loginerr = true;
                res.status(200).send({ emailerr, loginerr })
                return
            }
            else
                next()
        })
        .catch(err => res.status(200).send({ error: "Something went Wrong! Please try Later" }))
}

exports.checkIfExist = (req, res, next) => { 
    const { email, login } = req.body;
    User.checkIfExist(req.id_user, email, login) 
        .then((ret) => {
            if (ret[0][0][0] || ret[1][0][0]) {
                let emailerr = false
                let loginerr = false
                if (ret[0][0][0])
                    emailerr = true;
                if (ret[1][0][0])
                    loginerr = true;
                res.status(200).send({ emailerr, loginerr })
                return
            }
            else
                next()
        })
        .catch(err => res.status(500).send({ error: "Something went Wrong! Please try Later" }))
}

exports.checkIfValidPass = (req, res, next) => {
    const { opassword } = req.body; 
    if(!opassword) next()
    else {
        User.getById(req.id_user) 
            .then( async ([[user]]) => {
                try {
                    const passCompare = await bcrypt.compare(opassword, user.password)
                    if (!passCompare) res.status(200).send({passError: true})
                    else next()
                } catch (e) {
                    res.status(500).send({error: "Something went Wrong! Please try Later"})
                }
            })
            .catch(err => res.status(500).send({ error: "Something went Wrong! Please try Later" }))
    }
}