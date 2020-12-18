require('dotenv').config()

const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string')

const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

let token = null
const User = require('../models/User')
const helpers = require('../tools/helpers')

const tokenExprire = 3 * 24 * 3600 // 3days in second

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


    token = cryptoRandomString({ length: 64, type: 'alphanumeric' });
    bcrypt.genSalt(10)
        .then((salt) => { return bcrypt.hash(req.body.password, salt) })
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
                .then(() => {
                    const subject = 'Email Confirmation'
                    const html = `<p>Hello ${user.login} Your account was created successfuly you need to verify your account to login please <a href="${process.env.CLIENT_URL}/verify/${token}/">click here</a>`
                    helpers.sendEmail(user.email, subject, html)
                    res.status(201).send({ message: 'user register success', error: false, success: true })
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
                    User.updateStatusByToken(user.id_user)
                        .then(() => res.send({ message: 'Account is activated you can login now', error: false, success: true }))
                        .catch((err) => res.status('500').send({ message: err.message, error: true, success: false ,special:false}))
                }
                else res.status('200').send({ message: 'This verification link is expired! Request a new one', error: true, success: false, special:true })
            }
            else res.status('200').send({ message: 'This account is already verified, you can login', error: true, success: false ,special:false})
        })
        .catch(() => res.status('200').send({ message: 'Something went Wrong! Request a new verification link', error: true, success: false , special:true}))
}

//login dyal lay7ssan 3wan
exports.login = (req, res) => {
    const { login, password } = req.body
    User.getByLogin(login)
        .then(async ([[user]]) => {
            const passCompare = await bcrypt.compare(password, user.password)
            if (passCompare) {
                const jwt = createToken(user.id_user)
                res.cookie('jwt', jwt, { httpOnly: true, maxAge: tokenExprire * 1000 })
                if (user.status != 0) {
                    res.status(200).send({ message: 'you re logged in', error: false, success: true })
                }
                else res.status(200).send({ message: 'You need to verify your account first', error: true, success: false })
            }
            else res.status(200).send({ message: 'The username or password is incorrect', error: true, success: false })
        })
        .catch(() => res.status(200).send({ message: `The username or password is incorrect`, error: true, success: false }))
}

exports.updateToken = (req, res) => {
    token = cryptoRandomString({ length: 64, type: 'alphanumeric' });
    User.getByLogin(req.body.login)
        .then(([[user]]) => {
            if (user.status == 0) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                const limit = 10
                if (diff >= limit){
                    User.updateToken(token, user.id_user)
                        .then(() => {
                            const subject = 'Email Confirmation'
                            const html = `<p>Hello ${user.login} Your account was created successfuly you need to verify your account to login please <a href="${process.env.CLIENT_URL}/verify/${token}/">click here</a>`
                            helpers.sendEmail(user.email, subject, html)
                            res.send({ message: 'Email verification was sent', error: false, success: true })
                        })
                        .catch(err => res.status(500).send({ message: err.message, error: true, success: false }))
                }
                else res.status('200').send({ message: `A verification mail already sent please retry after ${limit - diff} minute${limit-diff-1?'s':''}.`, error: true, success: false })
            }
            else res.status(200).send({ message: 'This account is already verified.', error: true, success: false })
        })
        .catch(() => res.status(200).send({ message: 'Account not found.', error: true, success: false }))
}

exports.sendEmailReset = (req, res) => {
    let mailOptions = {
        from: process.env.EMAIL,
        to: req.user.email,
        subject: 'Reset Password',
        html: `<p>Hello ${req.user.login} Someone has requested a link to change your password. You can do this through the link below. <a href="http://localhost:8080/reset/${req.token}/">Change My Password</a>`
    }
    mailConf.sendMail(mailOptions, (err) => {
        if (err) res.send({ message: err, error: true, success: false })
        else res.send({ message: 'Reset Email was sent', error: false, success: true })
    })
}

exports.resetPassword = (req, res) => {
    const login = req.body.login
    token = cryptoRandomString({ length: 64, type: 'alphanumeric' });
    User.getByLogin(login)
        .then(([[user]]) => {
            if (user.status !== 0) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                const limit = 10
                if (diff >= limit){
                    User.updateToken(token, user.id_user)
                        .then(() => {
                            const subject = 'Reset Password'
                            const html = `<p>Hello ${user.login} Someone has requested a link to change your password. You can do this through the link below. <a href="${process.env.CLIENT_URL}/reset/${token}/">Change My Password</a>`
                            helpers.sendEmail(user.email, subject, html)
                            res.send({ message: 'Reset Email was sent', error: false, success: true })
                        })
                        .catch(err => res.status(500).send({ message: err.message, error: true, success: false }))
                }
                else res.status('200').send({ message: `A verification mail already sent please retry after ${limit - diff} minute${limit-diff-1?'s':''}.`, error: true, success: false })
            }
            else res.status(200).send({ message: 'Please Verify your account', error: true, success: false })
        })
        .catch(() => res.status(200).send({ message: 'Account not found', error: true, success: false }))
}

exports.passwordToken = (req, res) =>{
    User.getByToken(req.params.token)
    .then(([[user]]) => {
        if(user)
        {
            const now = new Date().getTime()
            const update = new Date(user.expire_token)
            const diff = Math.floor((now - update) / 60000)
            if (diff <= 60)
                res.status(200).send({ message: 'change password', success: true });
            else res.status('200').send({ message: 'This verification link is expired! Request a new one',success: false})
        }
        else
            res.status(200).send({ message: 'link incorrect', success: false })
        
    })
    .catch(() => res.status(200).send({ message: 'link incorrect', success: false }))
}

exports.changePassword = (req, res) => {
    User.getByToken(req.body.token)
        .then(([[user]]) => {
            const now = new Date().getTime()
            const update = new Date(user.expire_token)
            const diff = Math.floor((now - update) / 60000)
            if (diff <= 60)
            {
                bcrypt.genSalt(10)
                    .then((salt) => { return bcrypt.hash(req.body.npassword, salt) })
                    .then(hashPassword => {
                        User.setPassword(hashPassword, user.id_user)
                            .then(() => res.send({ message: 'password changed', success: true }))
                            .catch((err) => res.status('500').send({ message: err.message, success: false }))
                    })
                    .catch(err => res.status('500').send({ message: err.message, success: false }))
            }
            else
                res.status(200).send({ message: 'link expired', success: false })
        })
        .catch(() => res.status(200).send({ message: 'link incorrect', success: false }))
}