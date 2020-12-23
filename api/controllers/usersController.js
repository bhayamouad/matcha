require('dotenv').config()

const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string')

let token = null
const User = require('../models/User')
const helpers = require('../tools/helpers')
const auth = require('../tools/authentification.js')


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
        .catch(err => res.status(500).send({ message: err.message, error: true, success: false }))

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
                    res.status(201).send({ message: 'Your Account was created. Please go check your Inbox to verify your Account', error: false, success: true })
                })
                .catch(err => res.status(500).send({ message: err.message, error: true, success: false }))
        })
        .catch(err => res.status(500).send({ message: err.message, error: true, success: false }))
}


exports.verifyAccount = (req, res) => {
    let token = req.params.token
    User.getByToken(token)
        .then(([[user]]) => {
            if (user.status == 0) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                if (diff <= 60*24) {
                    User.updateStatus(user.id_user)
                        .then(() => res.send({ message: 'Account is activated you can login now', error: false }))
                        .catch((err) => res.status('500').send({ message: err.message, error: true}))
                }
                else res.status('200').send({ message: 'This verification link is expired! Request a new one', error: true, special:true })
            }
            else res.status('200').send({ message: 'This account is already verified, you can login', error: true })
        })
        .catch(() => res.status('200').send({ message: 'Something went Wrong! Request a new verification link', error: true, special:true}))
}

exports.login = (req, res) => {
    const { login, password } = req.body
    User.getByLogin(login)
        .then(async ([[user]]) => { 
            const passCompare = await bcrypt.compare(password, user.password)
            
            if (passCompare) {
                if (user.status != 0) {
                    const accessJWT = helpers.createAccessToken(user)
                    const refreshJWT = helpers.createRefreshToken(user)
                    // cookiePaser.set('test', accessJWT)
                    // res.cookie('test', 'eygfegwifgweigfiuwg')
                    res.status(200).send({ message: 'You are logged in', accessToken: accessJWT, refreshToken: refreshJWT, error: false })
                }
                else res.status(200).send({ message: 'You need to verify your account first', error: true, special:true })
            }
            else res.status(200).send({ message: 'The username or password is incorrect', error: true })
        })
        .catch(() => res.status(200).send({ message: 'The username or password  is incorrect', error: true}))
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
                if (diff >= limit){
                    User.updateToken(token.key, user.id_user)
                        .then(() => {
                            const subject = 'Email Confirmation'
                            const html = `<p>Hello ${user.login} Your account was created successfuly you need to verify your account to login please <a href="${process.env.CLIENT_URL}/verify/${token.key}/">click here</a>`
                            helpers.sendEmail(user.email, subject, html)
                            res.send({ message: 'Email verification was sent Please go check your Inbox', error: false, redirect: true })
                        })
                        .catch(err => res.status(500).send({ message: err.message, error: true }))
                }
                else res.status('200').send({ message: `A verification mail already sent please retry after ${limit - diff} minute${limit-diff-1?'s':''}.`, error: true })
            }
            else res.status(200).send({ message: 'This account is already verified. You can login now', error: true, redirect: true })
        })
        .catch(() => res.status(200).send({ message: 'Account not found.', error: true }))
}

exports.sendEmailReset = (req, res) => {
    let mailOptions = {
        from: process.env.EMAIL,
        to: req.user.email,
        subject: 'Reset Password',
        html: `<p>Hello ${req.user.login} Someone has requested a link to change your password. You can do this through the link below. <a href="http://localhost:8080/reset/${req.token}/">Change My Password</a>`
    }
    mailConf.sendMail(mailOptions, (err) => {
        if (err) res.send({ message: err, error: true })
        else res.send({ message: 'Reset Email was sent', error: false })
    })
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
                if (diff >= limit){
                    User.updateToken(token.key, user.id_user)
                        .then(() => {
                            const subject = 'Reset Password'
                            const html = `<p>Hello ${user.login} Someone has requested a link to change your password. You can do this through the link below. <a href="${process.env.CLIENT_URL}/reset/${token.key}/">Change My Password</a>`
                            helpers.sendEmail(user.email, subject, html)
                            res.send({ message: 'Reset Email was sent', error: false })
                        })
                        .catch(err => res.status(500).send({ message: err.message, error: true }))
                }
                else res.status('200').send({ message: `A verification mail already sent please retry after ${limit - diff} minute${limit-diff-1?'s':''}.`, error: true })
            }
            else res.status(200).send({ message: 'Please Verify your account', error: true})
        })
        .catch(() => res.status(200).send({ message: 'Account not found', error: true }))
}

exports.passwordToken = (req, res) =>{
    User.getByToken(req.params.token)
    .then(([[user]]) => {
        if(user)
        {
            const now = new Date().getTime()
            const update = new Date(user.expire_token)
            const diff = Math.floor((now - update) / 60000)
            if (diff <= 3)
                res.status(200).send({ error: false });
            else res.status('200').send({ message: 'This verification link is expired! Request a new one', error: true})
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
            if (diff <= 3)
            {
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