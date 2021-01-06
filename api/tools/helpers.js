require('dotenv').config()
const nodemailer = require('nodemailer')
const crypto = require("crypto-js")
const NodeGeocoder = require('node-geocoder')
const publicIp = require('public-ip')
const request = require('request')

exports.hashHmacSha256 = (string) => crypto.AES.encrypt(string, process.env.SECRET_KEY);


const geoOptions = {
    provider: 'google',
    apiKey: 'AIzaSyAmDARYa-puuDsAWPOU2nfKCC_RusalumM',
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
exports.ipLocationFinderAPI = (ip) => {
    return new Promise((resolve, reject) => {
        request(`https://tools.keycdn.com/geo.json?host=${ip}`, { json: true }, (err, res, body) => {
          if (err) reject(err)
          resolve(body)
        });
    })
}