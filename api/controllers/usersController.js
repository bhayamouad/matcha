require('dotenv').config()

const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

let token = null
const User = require('../models/User')

const mailConf = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls:{
        rejectUnauthorized:false
    },
    secure: false
})

const tokenExprire = 3 * 24 * 3600 // 3days in second
const createToken = (id) => { 
        return jwt.sign( { id_user: id }, process.env.SECRET_KEY, { expiresIn: tokenExprire }) 
    }

exports.sendEmailVerification = (req, res) => { 
    let mailOptions = {
        from: process.env.EMAIL,
        to: req.user.email,
        subject: 'Email verification',
        html: `<p>Hello ${req.user.login} Your account was created successfuly you need to verify your account to login please <a href="http://192.168.99.122:3000/account/verify/${req.token}/">click here</a>`
    }
    mailConf.sendMail(mailOptions, (error) => {
        if(error)   res.send({ message:`error ${error}` })
        else    res.send({ message: 'user register success' })
    })
}

exports.verifyAccount = (req,res) => {
    token = req.params.token
    User.getByToken(token)
        .then( ([[user]]) => {
            if(user.status == 0) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update)/60000)
                if(diff <= 10){
                    User.updateStatusByToken(user.id)
                    .then( () => res.send({ message: 'your account is active you can login now' }))
                    .catch( (err) => res.status('500').send({ message: err.message || 'Internal server error' }))
                }
                else res.status('200').send({ message: 'Link expired' })
            }
            else res.status('200').send({ message: 'user already verified' })
        })
        .catch( () => res.status('200').send({ message: 'user not found' }))
}

//login dyal lay7ssan 3wan
exports.login = (req,res) => {
    const {login, password} = req.body
    User.getByLogin(login)
        .then( async ([[user]]) => {
            if(user.status != 0)
            {
                const passCompare = await bcrypt.compare(password, user.password)
                if(passCompare) {
                    const jwt = createToken(user.id_user)
                    res.cookie('jwt', jwt, {httpOnly: true, maxAge: tokenExprire * 1000 })
                    res.status(200).send({ message : 'you re logged in' }) 
                    // redirect to complete registration

                    // redirection a sat should be done on the client side
                }
                else res.status(200).send({ message : 'The username or password is incorrect' })
            }
            else res.status(200).send({ message : 'You need to verify your account first'})
        })
        .catch( () => res.status(200).send({ message: `The username or password is incorrect` }))
}



exports.sendEmailReset = (req, res) => {
    let mailOptions = {
        from: process.env.EMAIL,
        to: req.user.email,
        subject: 'Reset Password',
        html: `<p>Hello ${req.user.login} Someone has requested a link to change your password. You can do this through the link below. <a href="http://192.168.99.122:8080/reset/${req.token}/">Change My Password</a>`
    }
    mailConf.sendMail(mailOptions, (error) => { 
        if(error)   res.send({ message:`error ${error}` })
        else    res.send({ message: 'Reset Email was sent' })
    })
}

exports.changePassword = (req,res) => {
    User.getByToken(req.body.token)
        .then( ([[user]]) => {
            bcrypt.genSalt(10)
            .then( (salt) => { return bcrypt.hash(req.body.npassword, salt) })
            .then(hashPassword => {
                User.setPassword(hashPassword, user.id_user)
                        .then( () => res.send({ message: 'password changed' }))
                        .catch( (err) => res.status('500').send({ message: err.message || 'Internal server error' }))
            })
            .catch(err => res.status('500').send({message: err.message || `hash prob`}))
        })
        .catch( () => res.status(200).send({ message: 'link incorrect' }))

}

exports.registerValidation = (req, res, next) => {
    if(!req.body) res.status('400').send({message: `content prob`}) // to discuss validation
    const {email, login} = req.body;
    User.ifUnique(email, login)
    .then((ret)=>{
       if(ret[0][0][0] || ret[1][0][0])
       {
           let emailerr = false
           let loginerr = false
            if(ret[0][0][0])
                emailerr = true;
            if(ret[1][0][0])
                loginerr = true;
            res.status(200).send({emailerr, loginerr})
            return
       }
       else
            next()
    })
    .catch(err => res.status(500).send( { message : err.message }))

}

exports.registerAccount = async (req, res, next) => {


    token = cryptoRandomString({length: 64, type: 'alphanumeric'});
    bcrypt.genSalt(10)
        .then( (salt) => { return bcrypt.hash(req.body.password, salt) })
        .then(hashPassword => {
            const user = new User({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                login: req.body.login,
                password: hashPassword,
                token: token
            })
            user.create()
                .then( () => {
                    req.user = user
                    req.token = tken
                    next()
                })
                .catch(err => res.status('500').send({ message: err.message ||`Internal server error` }))
                //redirect and flash
        })
        .catch(err => res.status('500').send({message: err.message || `hash prob`}))
}

exports.updateToken = (req, res, next) => {
    token = cryptoRandomString({length: 64, type: 'alphanumeric'});
    User.getByLogin(req.body.email)
        .then( ([[user]]) => {
            if (user.status == 0) {
                User.updateToken(token, req.body.email)
                    .then( () => {
                        req.user = user
                        req.token = token
                        next()   
                    })
                    .catch( err => res.status(500).send( { message : err.message } ))
            }
            else res.status(200).send({ message: 'user alredy verified'})

        })
        .catch( () => res.status(200).send( {message: 'email not found'} ))
}

exports.resetPassword = (req, res, next) => {
    const login = req.body.login
    token = cryptoRandomString({length: 64, type: 'alphanumeric'});
    User.getByLogin(login)
    .then( ([[user]]) => {
        if (user.status !== 0) {
            User.updateToken(token, user.id_user)  
                .then( () => {
                    req.user = user
                    req.token = token
                    next()   
                })
                .catch( err => res.status(500).send( { message : err.message } ))
        }
        else res.status(200).send({ message: 'Please Verify your account'})
    })
    .catch( () => res.status(200).send({ message: `The Username is incorrect` }) )
}