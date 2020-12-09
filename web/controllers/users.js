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

exports.registerValidation = (req, res, next) => {
    if(!req.body) res.status('400').send({message: `content prob`}) //validation input server side
        next()
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
                .then( () => next())
                .catch(err => res.status('500').send({ message: err.message ||`Internal server error` }))
                //redirect and flash
        })
        .catch(err => res.status('500').send({message: err.message || `hash prob`})) //hash password
}

exports.updateToken = (req, res, next) => {
    token = cryptoRandomString({length: 64, type: 'alphanumeric'});
    User.updateToken(req.body.email)
        .then( () => next())
        .catch( err => res.status('500').send({ message : 'email not found '} ))
}

exports.sendEmailVerification = (req, res) => {
    let mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: 'Email verification',
        html: `<p>Hello ${req.body.login} Your account was created successfuly you need to verify your account to login please <a href="http://192.168.99.117:3000/account/verify/${token}/">click here</a>`
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
                const update = new Date(user.updated_at).getTime()
                const difference = Math.round((update - now) / 60000)
                res.json({difference, now, update})
                // User.updateStatusByToken(token)
                //         .then( () => res.send({ message: `your account is active you can login now` }))
                //         .catch( (err) => res.status('500').send({ message: err.message || `Internal server error` }))
            }
            else res.status('200').send({ message: `user already verified` })
        })
        .catch( (err) => res.status('200').send({ message: err.message || `user not found` }))
}

//login dyal lay7ssan 3wan
exports.login = (req,res) => {
    const {email, password} = req.body
    User.getByEmail(email)
        .then( async ([[user]]) => {
            if(user.status != 0) // to discuss
            {
                const passCompare = await bcrypt.compare(password, user.password)
                if(passCompare) {
                    const jwt = createToken(user.id_user)
                    res.cookie('jwt', jwt, {httpOnly: true, maxAge: tokenExprire * 1000 })
                    res.status(200).send({ message : 'you re logged in' }) // redirect to complete registration
                }
                else res.status(200).send({ message : 'incorrect password' })
            }
            else res.status(200).send({ message : 'please verify your account'})
        })
        .catch(err => res.status(200).send({ message: `user not found` }))
    // if(user)
    // {
    // }
    // if(test)
    //     res.send({message:`hello ${req.body.login} your are logged in with ${req.body.email}:${req.body.password}`})
    // else
    //     res.send({message:`Error try to login`})
}