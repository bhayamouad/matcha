require('dotenv').config()
const nodemailer = require('nodemailer')
const crypto = require("crypto-js")
const NodeGeocoder = require('node-geocoder')
const publicIp = require('public-ip')
const axios = require('axios')

exports.hashHmacSha256 = (string) => crypto.AES.encrypt(string, process.env.SECRET_KEY);


const geoOptions = {
    provider: 'google',
    apiKey: process.env.GMAPIKEY,
    formatter: null
}

const geocoder = NodeGeocoder(geoOptions)

exports.getLocation = async (lat, lon) => {
    return await geocoder.reverse({lat, lon})
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

exports.getPublicIp = async () => {
	return await publicIp.v4()
}
exports.ipLocationFinderAPI = async (ip) => {
    return await axios.get(`http://ip-api.com/json/${ip}`) 
}
exports.capitalize = (string) => {
    return string.replace(/^\w/, (c) => c.toUpperCase());
}