require('dotenv').config()
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
var crypto = require("crypto-js");

exports.hashHmacSha256 = (string) => crypto.AES.encrypt(string, process.env.SECRET_KEY);

const genKey = (id, password) => {
    // console.log(id +' '+password)
    return this.hashHmacSha256(id + password);
  }

const wrapedSendMail = (mailOptions) => {
    return new Promise( (resolve,reject) =>{
        let mailConfig = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD 
            },
            tls: {
            rejectUnauthorized: false
            },
            secure: false
        })
        mailConfig.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log("error is "+error);
                resolve(false); // or rejcet(false) but then we have to handle errors
            } 
            else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        })
    })
}
const accessExprire = 15 * 60 // 15min
const refreshExprire = 3 * 24 * 3600
exports.createAccessToken = (user) => {
    return jwt.sign({ 
        id_user: user.id_user,
        login: user.login,
        email: user.email
        }, process.env.SECRET_KEY, { expiresIn: accessExprire })
}

exports.createRefreshToken = (user) => {
    // console.log(user.id_user +' '+ user.password)
    const key = genKey(user.id_user, user.password).key
    // console.log(key)
    return jwt.sign({ id_user: user.id_user, key }, process.env.SECRET_KEY, { expiresIn: refreshExprire })
}

exports.sendEmail = async (to, subject, html) => { 
    let mailOptions = { 
        from: process.env.EMAIL,
        to,
        subject,
        html
    }
    let resp = await wrapedSendMail(mailOptions) 
    return resp
}
