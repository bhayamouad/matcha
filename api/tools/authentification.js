require('dotenv').config()

const jwt = require('jsonwebtoken')
const crypto = require("crypto-js");
const { createAccessToken } = require('./helpers');

const cryptSHA265 = (string) => crypto.SHA256(string, process.env.SECRET_KEY).toString();

user = {
    id_user : 1,
    login: 'abenani',
    email: 'abenani@mohmal.com',
    password: 'jdijwidj82hr3n'
}
//
const accTokenExp = 60 * 15
const refTokenExp = 24 * 3600



const createAccToken = (user)=>{
    const {id_user, login, email} = user
    const type = 'access'
    return jwt.sign({id_user, login, email, type}, process.env.SECRET_KEY, { expiresIn: accTokenExp })
}

const createRefToken = (user)=>{
    const {id_user, login, email} = user
    const key = cryptSHA265(user.id_user+user.password)
    const type = 'refresh'
    return jwt.sign({id_user, login, email, key, type}, process.env.SECRET_KEY, { expiresIn: refTokenExp })
}

const authorize = (req, res, next)=>{
    // const token = req.body.
    // res.send("done "+req.body.msg)
}


module.exports = {createAccToken, createRefToken, authorize}

// return: jwt expired  // invalid token