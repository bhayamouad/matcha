require('dotenv').config()
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')


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
const tokenExprire = 3 * 24 * 3600 // 3days in second

exports.createToken = (id) => {
    return jwt.sign({ id_user: id }, process.env.SECRET_KEY, { expiresIn: tokenExprire })
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