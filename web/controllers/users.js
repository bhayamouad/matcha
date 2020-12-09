require('dotenv').config()

const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string')
const nodemailer = require('nodemailer')

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

exports.registerValidation = (req, res, next) => {
    if(!req.body) res.status('400').send({message: `content prob`}) //validation input server side
    next()
}

exports.registerAccount = async (req, res, next) => {


    token = cryptoRandomString({length: 64, type: 'alphanumeric'}); //generate token // change 
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
                .then( () => next())
                .catch(err => res.status('500').send({ message: err.message ||`Internal server error` }))
                //redirect and flash
        })
        .catch(err => res.status('500').send({message: err.message || `hash prob`})) //hash password
}

exports.sendEmailVerification = (req, res) => {
    let mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: 'Email verification',
        html: `<p>Hello ${req.body.login} Your account was created successfuly you need to verify your account to login please <a href="http://localhost:3000/account/verify/${token}/">click here</a>`
    }
    mailConf.sendMail(mailOptions, (error) => {
        if(error)   res.send({ message:`error ${error}` })
        else    res.send({ message: 'user register success' })
    })
}

exports.verifyAccount = (req,res) => {
    token = req.params.token
    User.verify(token)
            .then( () => res.send({ message: `your account is active you can login now` }) )
            .catch( (err) => res.status('500').send({ message: err.message || `Internal server error` }))
}

//login dyal lay7ssan 3wan
exports.login = async (req,res) => {
    const test = await bcrypt.compare(req.body.password, '$2b$10$HrbgU7VwMRV62taSOpbNouyliV90a7Iq9msmV2AWZ7R5546xMx9TG')
    if(test)
        res.send({message:`hello ${req.body.login} your are logged in with ${req.body.email}:${req.body.password}`})
    else
        res.send({message:`Error try to login`})
}