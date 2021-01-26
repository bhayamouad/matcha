require('dotenv').config()

const fs = require('fs')
const bcrypt = require('bcrypt') 
const multer  = require('multer')
const axios = require('axios')

let token = null
const User = require('../models/User')
const Tag = require('../models/Tag')
const Position = require('../models/Position')
const Image = require('../models/Image')
const helpers = require('../tools/helpers')
const auth = require('../tools/authentication.js')  


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, helpers.hashHmacSha256(new Date().getTime().toString()).key+"."+file.mimetype.split('/')[1])
    }
})
// ***********Authorization************

exports.authorize = (req, res, next) => auth.authorize(req, res, next)

exports.authorized = (req, res) => { res.status(200).send({ state: 'AUTHORIZED', error: false }) }



// ************************************ 

exports.gglOauth = (req, res) => {
    // console.log(req.body)
    // res.send(req.body)
    const code = req.body.code
    axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
          client_id: process.env.CLIENT_GGL_ID,
          client_secret: process.env.CLIENT_GGL_KEY,
          redirect_uri: `${process.env.CLIENT_URL}/oauth/google`,
          grant_type: 'authorization_code',
          code,
        },
      }).then(({data})=>{
          return data.access_token;
      }).then((access_token)=>{
          return axios({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'get',
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
      }).then(({data})=>{
          console.log(data)
      })
      .catch(()=>{
          console.log('error')
      })
}

exports.fbOauth = (req, res) => {
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
          console.log(data)
      }).catch(()=>{
          console.log('error')
      })

}
// ************Oauth**************** 


// *********************************



exports.registerValidation = (req, res, next) => { 
    if (!req.body) res.status('400').send({ message: `content prob` }) // to discuss validation 
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
        .catch(err => res.status(500).send({ message: err.message, error: true }))

}

exports.registerAccount = (req, res) => {
    token = helpers.hashHmacSha256(Date.now().toString())
    bcrypt.genSalt(10)
        .then((salt) => { return bcrypt.hash(req.body.password, salt) })
        .then(hashPassword => {
            const user = new User({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                login: req.body.login,
                password: hashPassword,
                token: token.key
            })
            user.create()
                .then(() => {
                    const subject = 'Email Confirmation'
                    const html = `<p>Hello ${user.login} Your account was created successfuly you need to verify your account to login please <a href="${process.env.CLIENT_URL}/verify/${token.key}/">click here</a>`
                    helpers.sendEmail(user.email, subject, html)
                    res.status(201).send({ message: 'Your Account was created. Please go check your Inbox to verify your Account', error: false })
                })
                .catch(err => res.status(500).send({ message: err.message, error: true }))
        })
        .catch(err => res.status(500).send({ message: err.message, error: true }))
}


exports.verifyAccount = (req, res) => {
    let token = req.params.token
    User.getByToken(token)
        .then(([[user]]) => {
            if (user.status == 0) {
                const now = new Date().getTime() 
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                if (diff <= 60 * 24) {
                    User.updateStatus(user.id_user)
                        .then(() => res.send({ message: 'Account is activated you can login now', error: false }))
                        .catch((err) => res.status('500').send({ message: err.message, error: true }))
                }
                else res.status('200').send({ message: 'This verification link is expired! Request a new one', error: true })
            }
            else res.status('200').send({ message: 'This account is already verified, you can login', error: true })
        })
        .catch(() => res.status('200').send({ message: 'Something went Wrong! Request a new verification link', error: true, special: true }))
}

exports.login = (req, res) => {
    const { login, password } = req.body
    User.getByLogin(login)
        .then(async ([[user]]) => {
            const passCompare = await bcrypt.compare(password, user.password)

            if (passCompare) {
                if (user.status != 0) {

                    const accTok = auth.createAccToken(user)
                    const refTok = auth.createRefToken(user)

                    res.cookie('accTok', accTok, { httpOnly: true, maxAge: 1000 * 60 * 15 })
                    res.cookie('refTok', refTok, { httpOnly: true, maxAge: 1000 * 3600 * 24 * 3 })
                    res.status(200).send({ userStatus: user.status, error: false })
                }
                else res.status(200).send({ message: 'You need to verify your account first', error: true, special: true })
            }
            else res.status(200).send({ message: 'The username or password is incorrect', error: true })
        })
        .catch((e) => res.status(200).send({ message: 'The username or password  is incorrect', error: true }))
}

exports.logOut = (req, res) => {
    res.clearCookie('accTok');
    res.clearCookie('refTok');
    res.send({ error: false })
}


exports.updateToken = (req, res) => {
    token = helpers.hashHmacSha256(Date.now().toString())
    User.getByLogin(req.body.login)
        .then(([[user]]) => {
            if (user.status == 0) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                const limit = 10
                if (diff >= limit) {
                    User.updateToken(token.key.toString(), user.id_user)
                        .then(() => {
                            const subject = 'Email Confirmation'
                            const html = `<p>Hello ${user.login} Your account was created successfuly you need to verify your account to login please <a href="${process.env.CLIENT_URL}/verify/${token.key}/">click here</a>`
                            helpers.sendEmail(user.email, subject, html)
                            res.send({ message: 'Email verification was sent Please go check your Inbox', error: false, redirect: true })
                        })
                        .catch(err => res.status(500).send({ message: err.message, error: true }))
                }
                else res.status('200').send({ message: `A verification mail already sent please retry after ${limit - diff} minute${limit - diff - 1 ? 's' : ''}.`, error: true })
            }
            else res.status(200).send({ message: 'This account is already verified. You can login now', error: true, redirect: true })
        })
        .catch(() => res.status(200).send({ message: 'Account not found.', error: true }))
}

exports.resetPassword = (req, res) => {
    const login = req.body.login
    token = helpers.hashHmacSha256(Date.now().toString())
    User.getByLogin(login)
        .then(([[user]]) => {
            if (user.status !== 0) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                const limit = 3
                if (diff >= limit) {
                    User.updateToken(token.key.toString(), user.id_user)
                        .then(() => {
                            const subject = 'Reset Password'
                            const html = `<p>Hello ${user.login} Someone has requested a link to change your password. You can do this through the link below. <a href="${process.env.CLIENT_URL}/reset/${token.key}/">Change My Password</a>`
                            helpers.sendEmail(user.email, subject, html)
                            res.send({ message: 'Reset Email was sent', error: false })
                        })
                        .catch(err => res.status(500).send({ message: err.message, error: true }))
                }
                else res.status('200').send({ message: `A verification mail already sent please retry after ${limit - diff} minute${limit - diff - 1 ? 's' : ''}.`, error: true })
            }
            else res.status(200).send({ message: 'Please Verify your account', error: true })
        })
        .catch(() => res.status(200).send({ message: 'Account not found', error: true }))
}

exports.passwordToken = (req, res) => {
    User.getByToken(req.params.token)
        .then(([[user]]) => {
            if (user) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                if (diff <= 3)
                    res.status(200).send({ error: false });
                else res.status('200').send({ message: 'This link is expired! Request a new one', error: true })
            }
            else
                res.status(200).send({ message: 'link incorrect', error: true })

        })
        .catch(() => res.status(200).send({ message: 'link incorrect', error: true }))
}

exports.changePassword = (req, res) => {
    User.getByToken(req.body.token)
        .then(([[user]]) => {
            const now = new Date().getTime()
            const update = new Date(user.expire_token)
            const diff = Math.floor((now - update) / 60000)
            if (diff <= 3) {
                bcrypt.genSalt(10)
                    .then((salt) => { return bcrypt.hash(req.body.npassword, salt) })
                    .then(hashPassword => {
                        User.setPassword(hashPassword, user.id_user)
                            .then(() => res.send({ message: 'password changed', error: false }))
                            .catch((err) => res.status('500').send({ message: err.message, error: true }))
                    })
                    .catch(err => res.status('500').send({ message: err.message, error: true }))
            }
            else
                res.status(200).send({ message: 'link expired', error: true })
        })
        .catch(() => res.status(200).send({ message: 'link incorrect', error: true }))
}
exports.setProfile = async (req, res) => {
    const { gender, birthdate, interest, bio, tags, lat, lng, newTags } = req.body
    const data = {
        gender,
        birthdate: new Date(birthdate.toString()),
        interest,
        tags: tags.toString(),
        bio
    }
    let pos = null
    if (lat && lng) {
        try {
            const [location] = await helpers.getLocation(lat, lng)
            position = new Position({
                city: `${location.city},${location.country}`,
                lat,
                lng,
                user_id: req.id_user,
            })
        } catch (error) {
            return res.send({ message: error.message, error: true })
        }
    }
    else {
        try { 
            const ip = await helpers.getPublicIp()
            const res = await helpers.ipLocationFinderAPI(ip)
            position = new Position({
                city: `${res.data.geo.city},${res.data.geo.country_name}`,
                lat: res.data.geo.latitude,
                lng: res.data.geo.longitude,
                user_id: req.id_user,
            })
            try {
                await position.save()
            } catch (err) {
                await Position.update(position)
            }
        } catch (error) {
            return res.send({ message: error.message, error: true }) 
        }
    }
    newTags.forEach(async (tag) => {
        try {
            await Tag.save(tag)
        } catch (error) {
            return res.send({ message: error.message, error: true })
        }
    })
    User.setProfile(data, req.id_user)
        .then(() => res.status(200).send({ message: `success` }))
        .catch(err => res.send({ message: err.message }))
}

exports.getTags = (req, res) => {
    Tag.getAll()
        .then(([tags]) => {
            const tagsList = []
            tags.forEach(tag => {
                tagsList.push(tag.tag) 
            });
            res.send({ tags: tagsList })
        })
        .catch(err => res.send({ message: err.message }))
}

exports.getStatus = (req, res) => { 
    User.getStatusById(req.id_user)
        .then(([[user]]) => res.status(200).send({status: user.status, error: false}))
        .catch(err => res.send({ message:err.message, error: true}))
}

exports.acceptPrivacy = (req, res) => {
    User.setStatusById(req.id_user)
        .then(() => res.status(200).send({error: false}))
        .catch(err => res.send({message:err.message, error: true}))   
}
 
exports.saveImages = (req, res) => {
    Image.getUserImages(req.id_user)
        .then(([userImages]) => {
            let upload = multer({storage}).array('images',5) 
            upload(req, res, async (err) => {
                let imagesList = req.files  
                if(userImages.length === 0){ 
                    imagesList.forEach(async (imageFile, index) => {  
                        const image = new Image({
                            path: imageFile.path.split('/')[1],
                            user_id: req.id_user,
                            is_profile: index 
                        })
                        await image.save()  
                    })
                }
                else {
                    const limit = userImages.length - imagesList.length
                    if (limit > 0)
                        await Image.deleteUserImages(req.id_user, limit)
                    else{
                        userImages.forEach( (image,index) => {  
                            Image.updateImage(image.is_profile, imagesList[image.is_profile].path)
                            .then(()=>{
                                imagesList.splice(0, 1) 
                                fs.unlinkSync(image.path)
                                if(index+1 === userImages.length){
                                    imagesList.forEach(async (imageFile) => {   
                                        const image = new Image({
                                            path: imageFile.path.split('/')[1],
                                            user_id: req.id_user,
                                            is_profile: ++index
                                        })
                                        await image.save() 
                                    })
                                }
                            }) 
                            .catch(err => console.log("ERROR UPDATE"))   
                        })
                    }
                }
            })
        res.send({error: false}) 
    })
}

exports.getLoggedUser = async (req, res) => {
    let loggedUser = {
        name: null,
        username: null,
        profile: null
    }
    const [[user]] = await User.getById(req.id_user).catch(err => console.log(err.message))
    const [[profile]] = await Image.getUserProfile(req.id_user).catch(err => console.log(err.message))
    if(user){
        loggedUser.name = `${helpers.capitalize(user.fname)} ${helpers.capitalize(user.lname)}`
        loggedUser.username = user.login
    }
    if(profile)
        loggedUser.profile = `${process.env.API_URL}/${profile.path}`
    if(user || profile)
        res.status(200).send({loggedUser})
    else
        res.status(204).send({message:'error loggeduser'})
}