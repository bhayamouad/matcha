require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const crypto = require("crypto-js");


const cryptSHA265 = (string) => crypto.SHA256(string, process.env.SECRET_KEY).toString();

const accTokenExp = 60 * 15
const refTokenExp = 24 * 3600 * 3

const createAccToken = (user)=>{
    const {id_user} = user
    const type = 'access'
    return jwt.sign({id_user, type}, process.env.SECRET_KEY, { expiresIn: accTokenExp })
}

const createRefToken = (user)=>{
    const {id_user} = user
    const key = cryptSHA265(user.id_user+user.password)
    const type = 'refresh'
    return jwt.sign({id_user, key, type}, process.env.SECRET_KEY, { expiresIn: refTokenExp })
}

const authorize = (req, res, next)=>{
    const accTok = req.cookies.accTok
    const refTok = req.cookies.refTok
    try{
        if(!refTok)
        {
            res.clearCookie('accTok');
            throw Error('refToken must be provided');
        }
        const accPayload = jwt.verify(accTok, process.env.SECRET_KEY) 
        if(accPayload.type != 'access')
            throw Error('wrong token type');
        req.id_user = accPayload.id_user
        next()
    }catch(e)
    {
        if(e.message == 'jwt expired' || e.message == 'jwt must be provided')
            try{
                const refPayload = jwt.verify(refTok, process.env.SECRET_KEY)
                if(refPayload.type != 'refresh')
                    throw Error('wrong token type'); 
                User.getById(refPayload.id_user)
                .then(([[user]]) =>{
                    if(user && refPayload.key == cryptSHA265(user.id_user+user.password))
                    {
                        const newAccTok = createAccToken(user)
                        res.cookie('accTok', newAccTok, {httpOnly: true, maxAge:1000 * 60 * 15})
                        req.id_user = user.id_user
                        next()
                    }
                    else
                        res.status(200).send('invalid reftok key')
                })
            }catch(e){
                res.status(201).send(e.message)
            }
        else
            res.status(202).send(e.message)
    }

}

module.exports = {createAccToken, createRefToken, authorize}
