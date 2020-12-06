const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string')
const nodemailer = require('nodemailer')


const User = require('../models/User')
const mailConf = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'matcha1337.no.reply@gmail.com',
        pass:'tirachrach'
    }
})

exports.register = (req,res) => {
    if(!req.body) res.status('400').send({message: `content prob`}) //validation input server side

    const token = cryptoRandomString({length: 64, type: 'url-safe'}); //generate token
    const hashPassword = bcrypt.hashSync(req.body.password, 10); //hash password
    const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        login: req.body.login,
        password: hashPassword,
        token: token
    })
    User.create(user, (err,data) => {
        if(err) res.status('500').send({ message: err.message ||`Internal server error` })
        else {
            let mailOptions = {
                from:'matcha1337.no.reply@gmail.com',
                to: data.email,
                subject: 'Email verification',
                html: `<p>Hello ${data.login} Your account was created successfuly you need to verify your account to login please <a href="http://192.168.99.17:3000/account/verify/${data.token}/">click here</a>`
            }
            mailConf.sendMail(mailOptions, (error) => {
                if(error)   console.log('error ',error)
                else  console.log('user register success')
            })
        }
    })
}
//login dyal lay7ssan 3wan
exports.login = (req,res) => {
    if(req.body.login === 'mbhaya' && req.body.password === '123456')
        res.send({message:`hello ${req.body.login} your are logged in with ${req.body.email}:${req.body.password}`})
    else
        res.send({message:`Error try to login`})
}