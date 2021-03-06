require('dotenv').config()

const fs = require('fs')
const bcrypt = require('bcrypt')
const multer = require('multer')
const axios = require('axios')

let token = null
const User = require('../models/User')
const Tag = require('../models/Tag')
const Like = require('../models/Like')
const History = require('../models/History')
const Position = require('../models/Position')
const Image = require('../models/Image')
const Notification = require('../models/Notification')
const helpers = require('../tools/helpers')
const auth = require('../tools/authentication.js')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, helpers.hashHmacSha256(new Date().getTime().toString()).key + ".png")
    }
})

exports.authorized = (req, res) => { res.status(200).send({ state: 'AUTHORIZED' }) }

exports.connectOrRegister = (req, res) => {
    const userdata = req.userdata
    User.getByOauthId(userdata.oauth_id)
        .then(([[user]]) => {
            if (user) {
                const accTok = auth.createAccToken(user)
                const refTok = auth.createRefToken(user)
                res.cookie('accTok', accTok, { httpOnly: true, maxAge: 1000 * 60 * 15 })
                res.cookie('refTok', refTok, { httpOnly: true, maxAge: 1000 * 3600 * 24 * 3 })
                throw Error("no error");
            }
            else
                return User.createOauth(userdata)
        }).then(([registredUser]) => {
            return User.oauthUpLogin(registredUser.insertId)
                .then(_ => { return registredUser.insertId })
        }).then((id) => {
            return User.getById(id);
        })
        .then(([[newUser]]) => {
            const accTok = auth.createAccToken(newUser)
            const refTok = auth.createRefToken(newUser)
            res.cookie('accTok', accTok, { httpOnly: true, maxAge: 1000 * 60 * 15 })
            res.cookie('refTok', refTok, { httpOnly: true, maxAge: 1000 * 3600 * 24 * 3 })
            res.status(200).send({ error: false })
        })
        .catch((e) => {
            if (e.message === 'no error')
                res.status(200).send({ error: false })
            else if (e.message === `Duplicate entry '${userdata.email}' for key 'users.email'`)
                res.status(200).send({ error: 'The Email linked to your social media account Already used!' })
            else
                res.status(200).send({ error: 'Something went Wrong! Please try Later' })
        })
}

exports.isOauth = (req, res) => {
    User.getById(req.id_user)
        .then(([[user]]) => {
            res.status(200).send({ pass: !!user.password })
        })
        .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
}

exports.registerAccount = (req, res) => {
    token = helpers.hashHmacSha256(Date.now().toString())
    bcrypt.genSalt(10)
        .then((salt) => { return bcrypt.hash(req.body.password, salt) })
        .then(hashPassword => {
            const user = new User({
                fname: helpers.capitalize(req.body.fname),
                lname: helpers.capitalize(req.body.lname),
                email: req.body.email,
                login: req.body.login,
                password: hashPassword,
                token: token.key
            })
            user.create()
                .then(() => {
                    const subject = 'Email Confirmation'
                    const html = `<p>Hello ${user.login} Your account was created successfuly you need to verify your account to login please <a href="${process.env.CLIENT_URL}/verify/${token.key}/">click here</a>`
                    helpers.sendEmail(user.email, subject, html)
                    res.status(200).send({ message: 'Your Account was created. Please go check your Inbox to verify your Account' })
                })
                .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
        })
        .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
}

exports.verifyAccount = (req, res) => {
    let token = req.params.token
    User.getByToken(token)
        .then(([[user]]) => {
            if (user.status == 0) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                if (diff <= 60 * 24) {
                    User.updateStatus(user.id_user)
                        .then(() => res.send({ message: 'Account is activated you can login now' }))
                        .catch((err) => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                }
                else res.status(200).send({ error: 'This verification link is expired! Request a new one' })
            }
            else res.status(200).send({ error: 'This account is already verified, you can login' })
        })
        .catch(() => res.status(200).send({ error: 'Something went Wrong! Request a new verification link', special: true }))
}

exports.login = (req, res) => {
    const { login, password } = req.body
    try {
        User.getByLogin(login)
            .then(async ([[user]]) => {
                const passCompare = await bcrypt.compare(password, user.password)
                if (passCompare) {
                    if (user.status != 0) {
                        const accTok = auth.createAccToken(user)
                        const refTok = auth.createRefToken(user)

                        res.cookie('accTok', accTok, { httpOnly: true, maxAge: 1000 * 60 * 15 })
                        res.cookie('refTok', refTok, { httpOnly: true, maxAge: 1000 * 3600 * 24 * 3 })
                        res.status(200).send({ userStatus: user.status })
                    }
                    else res.status(200).send({ error: 'You need to verify your account first', special: true })
                }
                else res.status(200).send({ error: 'The username or password is incorrect' })
            })
            .catch((e) => res.status(200).send({ error: 'The username or password  is incorrect' }))
    } catch (error) {
        res.status(200).send({ error: 'Something went Wrong! Please try Later' })
    }
}

exports.logOut = (req, res) => {
    res.clearCookie('accTok');
    res.clearCookie('refTok');
    res.send({ error: false })
}

exports.updateToken = (req, res) => {
    token = helpers.hashHmacSha256(Date.now().toString())
    User.getByLogin(req.body.login)
        .then(([[user]]) => {
            if (user.status == 0) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                const limit = 10
                if (diff >= limit) {
                    User.updateToken(token.key.toString(), user.id_user)
                        .then(() => {
                            const subject = 'Email Confirmation'
                            const html = `<p>Hello ${user.login} Your account was created successfuly you need to verify your account to login please <a href="${process.env.CLIENT_URL}/verify/${token.key}/">click here</a>`
                            helpers.sendEmail(user.email, subject, html)
                            res.send({ message: 'Email verification was sent Please go check your Inbox', redirect: true })
                        })
                        .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                }
                else res.status(200).send({ error: `A verification mail already sent please retry after ${limit - diff} minute${limit - diff - 1 ? 's' : ''}.` })
            }
            else res.status(200).send({ error: 'This account is already verified. You can login now.', redirect: true })
        })
        .catch(() => res.status(200).send({ error: 'Account not found.' }))
}

exports.resetPassword = (req, res) => {
    const login = req.body.login
    token = helpers.hashHmacSha256(Date.now().toString())
    User.getByLogin(login)
        .then(([[user]]) => {
            if (user.status !== 0) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                const limit = 3
                if (diff >= limit) {
                    User.updateToken(token.key.toString(), user.id_user)
                        .then(() => {
                            const subject = 'Reset Password'
                            const html = `<p>Hello ${user.login} Someone has requested a link to change your password. You can do this through the link below. <a href="${process.env.CLIENT_URL}/reset/${token.key}/">Change My Password</a>`
                            helpers.sendEmail(user.email, subject, html)
                            res.status(200).send({ message: 'An email to reset you password was sent' })
                        })
                        .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                }
                else res.status(200).send({ error: `A verification mail already sent please retry after ${limit - diff} minute${limit - diff - 1 ? 's' : ''}.` })
            }
            else res.status(200).send({ error: 'Please you need to Verify your account', special: true })
        })
        .catch(() => res.status(200).send({ error: 'Account not found' }))
}

exports.passwordToken = (req, res) => {
    User.getByToken(req.params.token)
        .then(([[user]]) => {
            if (user) {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                if (diff <= 3)
                    res.status(200).send({ error: false });
                else res.status(200).send({ error: 'This link is expired! Request a new one' })
            }
            else
                res.status(200).send({ error: 'This link is incorrect' })
        })
        .catch(() => res.status(200).send({ error: 'This link is incorrect' }))
}

exports.changePassword = (req, res) => {
    if (req.id_user) {
        User.getById(req.id_user)
            .then(([[user]]) => {
                bcrypt.genSalt(10)
                    .then((salt) => { return bcrypt.hash(req.body.npassword, salt) })
                    .then(hashPassword => {
                        User.setPassword(hashPassword, user.id_user)
                            .then(() => res.send({ message: 'Your password was changed' }))
                            .catch((err) => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                    })
                    .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
            })
            .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
    }
    if (req.body.token) {
        User.getByToken(req.body.token)
            .then(([[user]]) => {
                const now = new Date().getTime()
                const update = new Date(user.expire_token)
                const diff = Math.floor((now - update) / 60000)
                if (diff <= 3) {
                    bcrypt.genSalt(10)
                        .then((salt) => { return bcrypt.hash(req.body.npassword, salt) })
                        .then(hashPassword => {
                            User.setPassword(hashPassword, user.id_user)
                                .then(() => res.send({ message: 'Your password was changed' }))
                                .catch((err) => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                        })
                        .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                }
                else
                    res.status(200).send({ error: 'This link is incorrect' })
            })
            .catch(() => res.status(200).send({ error: 'This link is incorrect' }))
    }
}
exports.setProfile = async (req, res) => {
    const { fname, lname, email, login, gender, birthdate, interest, bio, tags, lat, lng } = req.body
    const data = {
        fname: helpers.capitalize(fname),
        lname: helpers.capitalize(lname),
        email,
        login,
        gender,
        birthdate: new Date(birthdate.toString()),
        interest,
        bio
    }
    let position = null
    try {
        if (lat !== false && lng !== false) {
            if (lat && lng) {
                const [location] = await helpers.getLocation(lat, lng)
                position = new Position({
                    city: `${location.city},${location.country}`,
                    lat,
                    lng,
                    user_id: req.id_user,
                })
            }
            else {
                const ip = await helpers.getPublicIp()
                const res = await helpers.ipLocationFinderAPI(ip)
                position = new Position({
                    city: `${res.data.city},${res.data.country}`,
                    lat: res.data.lat,
                    lng: res.data.lon,
                    user_id: req.id_user,
                })
            }
            await position.save()
        }

    } catch (error) {
        return res.status(200).send({ error: 'Something went Wrong! Please try Later' })
    }

    const uid = req.id_user;
    let tagsToDelete = [];
    let tagsToAdd = []
    Tag.getUserTags(uid)
        .then(([ret]) => {

            ret.forEach((elm) => {
                if (!tags.includes(elm.tag))
                    tagsToDelete.push(elm.id_tag)
            })
            tagsToDelete = tagsToDelete.toString()
            if (tagsToDelete) {
                Tag.deleteTags(uid, tagsToDelete)
                    .catch((e) => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
            }

            tags.forEach((elm) => {
                let flag = false;
                ret.forEach((r_elm) => {
                    if (elm == r_elm.tag)
                        flag = true;
                })
                if (!flag)
                    tagsToAdd.push(elm)
            })

            tagsToAdd.forEach((tag) => {
                Tag.getByTag(tag)
                    .then(([[ret]]) => {
                        if (ret)
                            return ret.id_tag
                        else {
                            return Tag.save(tag)
                                .then(([ret]) => { return ret.insertId })
                                .catch(e => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                        }
                    })
                    .then(ret => {
                        Tag.saveUserTag(uid, ret)
                            .then(ret => { return ret })
                            .catch(e => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                    })
                    .catch(e => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
            })
        })
        .catch((e) => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
    User.setProfile(data, req.id_user)
        .then(() => res.status(200).send({ error: false }))
        .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
}

exports.getDataUser = (req, res) => {
    let data = {
        user: {},
        tagsList: [],
        userTags: []
    }
    try {
        Tag.getAll()
            .then(async ([tags]) => {
                tags.forEach(tag => {
                    data.tagsList.push(tag.tag)
                });

                const [[user]] = await User.getById(req.id_user)
                data.user = user
                const [userTags] = await Tag.getByUser(req.id_user)
                userTags.forEach(tag => {
                    data.userTags.push(tag.tag)
                });
                res.status(200).send({ data })

            })
            .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
    } catch (error) {
        res.status(200).send({ error: 'Something went Wrong! Please try Later' })
    }
}

exports.getStatus = (req, res) => {
    User.getStatusById(req.id_user)
        .then(([[user]]) => res.status(200).send({ status: user.status }))
        .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
}

exports.saveImages = (req, res) => {
    try {
        Image.getUserImages(req.id_user)
            .then(async ([userImages]) => {
                let upload = multer({ storage }).array('images', 5)
                upload(req, res, async (err) => {
                    let imagesFiles = req.files
                    if (imagesFiles.length === 0) {
                        await User.setStatusById(2, req.id_user)
                    }
                    else
                        await User.setStatusById(3, req.id_user)

                    if (userImages.length === 0) {
                        imagesFiles.forEach(async (imageFile, index) => {
                            const image = new Image({
                                path: imageFile.path.split('/')[1],
                                user_id: req.id_user,
                                is_profile: index
                            })
                            await image.save()
                        })
                        res.status(200).send({ error: false })
                    }
                    else {
                        let limit = userImages.length - imagesFiles.length
                        if (limit > 0) {
                            await Image.deleteUserImages(req.id_user, limit)
                            let i = userImages.length - 1
                            let j = limit
                            while (j--) {
                                fs.unlinkSync(`uploads/${userImages[i--].path}`)
                            }
                            userImages.splice(-limit)
                        }
                        if (userImages.length) {
                            userImages.forEach((image, index) => {
                                Image.updateImage(req.id_user, image.is_profile, imagesFiles[image.is_profile].path.split('/')[1])
                                    .then(() => {
                                        imagesFiles.splice(0, 1)
                                        fs.unlinkSync(`uploads/${image.path}`)
                                        if (index + 1 === userImages.length) {
                                            imagesFiles.forEach(async (imageFile) => {
                                                const image = new Image({
                                                    path: imageFile.path.split('/')[1],
                                                    user_id: req.id_user,
                                                    is_profile: ++index
                                                })
                                                await image.save()
                                            })
                                        }
                                        res.status(200).send({ error: false })
                                    })
                                    .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                            })
                        }
                        else
                            res.status(200).send({ error: false })
                    }
                })
            })
            .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
    }
    catch (error) {
        return res.status(200).send({ error: 'Something went Wrong! Please try Later' })
    }
}

exports.getLoggedUser = async (req, res) => {
    let loggedUser = {
        name: null,
        username: null,
        profile: null,
        status: null
    }
    try {
        const [[user]] = await User.getById(req.id_user)
        const [[profile]] = await Image.getUserProfile(req.id_user)
        if (user) {
            loggedUser.name = `${helpers.capitalize(user.fname)} ${helpers.capitalize(user.lname)}`
            loggedUser.username = (user.login) ? user.login : 'user' + user.id_user
            loggedUser.status = user.status
        }
        if (profile)
            loggedUser.profile = `${process.env.API_URL}/${profile.path}`
        res.status(200).send({ loggedUser })
    } catch (error) {
        return res.status(200).send({ error: 'Something went Wrong! Please try Later' })
    }

}

exports.getUserImages = async (req, res) => {
    let images = [null, null, null, null, null]
    try {
        const [userImages] = await Image.getUserImages(req.id_user)
        if (userImages) {
            userImages.forEach((image, index) => {
                images[index] = "data:image/png;base64," + fs.readFileSync('uploads/' + image.path, 'base64')
            })
        }
        res.status(200).send({ images })
    } catch (error) {
        return res.status(200).send({ error: 'Something went Wrong! Please try Later' })
    }
}

exports.getPositon = (req, res) => {
    Position.getByIdUser(req.id_user)
        .then(([[pos]]) => res.status(200).send({ position: pos }))
        .catch(err => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
}

exports.setPosition = async (req, res) => {
    const { lat, lng } = req.body
    try {
        const [location] = await helpers.getLocation(lat, lng)
        let position = {
            city: `${location.city},${location.country}`,
            lat,
            lng,
            user_id: req.id_user,
        }
        if (position.city === "undefined,undefined")
            res.status(200).send({ message: 'Please choose a valid position', error: true })
        else {
            Position.update(position)
                .then(() => res.status(200).send({ error: false }))
                .catch((err) => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
        }
    } catch (error) {
        res.status(200).send({ error: 'Something went Wrong! Please try Later' })
    }
}

exports.getProfileInfo = (req, res) => {
    let usr = req.body.username
    let isme = 0;
    if (!usr) {
        usr = req.id_user;
        isme = 1;
    }
    try {
        User.getUserProfile(usr, isme)
            .then(([[user]]) => {
                if (!user)
                    throw Error("notFound");
                return User.checkIfBlocked(req.id_user, user.id_user)
                    .then(([[ret]]) => {
                        if (!ret)
                            return user
                        else
                            return null
                    })
                    .catch(e => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
            })
            .then((user) => {
                let sendNotif = false
                if (user) {
                    if (user.id_user == req.id_user)
                        res.status(200).send({ user, block: false, is_me: true })
                    else {
                        return Like.isLiked(req.id_user, user.id_user)
                            .then(([[ret]]) => {
                                let liked
                                if (ret)
                                    liked = true
                                else
                                    liked = false
                                return History.insertHistory(req.id_user, user.id_user)
                                    .then(async () => {
                                        const check = await Notification.push('visit', req.id_user, user.id_user)
                                        if (check)
                                            sendNotif = true
                                        const [[loggedUser]] = await User.getById(req.id_user)
                                        res.status(200).send({user, liked, block: false, is_me: false, loggedUser: { login: loggedUser.login, status: loggedUser.status }, sendNotif })
                                    })
                                    .catch(e => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                            }).catch(e => res.status(200).send({ error: 'Something went Wrong! Please try Later' }))
                    }
                }
                else
                    res.status(200).send({ block: true })
            })
            .catch(e => {
                if (e.message == 'notFound')
                    res.status(200).send({ user: null })
                else
                    res.status(200).send({ error: 'Something went Wrong! Please try Later' })
            })
    } catch (error) {
        res.status(200).send({ error: 'Something went Wrong! Please try Later' })
    }
}

exports.reportUser = (req, res) => {
    try {
        if (req.body.usr != req.id_user) {
            User.reportUser(req.id_user, req.body.usr)
                .then(async ([ret]) => {
                    if (ret.affectedRows == 1) {
                        const [[reported]] = await User.getById(req.body.usr)
                        if ((parseInt(reported.rating) - 5) >= 0)
                            await User.setFameRating((parseInt(reported.rating) - 5), reported.id_user)
                        res.status(200).send({ error: false })
                    }
                })
                .catch(e => {
                    if (e.message.split(' ')[0] === "Duplicate")
                        res.status(200).send({ error: "You already reported this Account" })
                })
        }
        else
            res.status(200).send({ error: "You cant report yourself!!" })
    } catch (error) {
        res.status(200).send({ error: "Something went Wrong! Please try Later" })
    }
}
exports.blockUser = (req, res) => {
    try {
        if (req.body.usr != req.id_user) {
            User.blockUser(req.id_user, req.body.usr)
                .then(async ([ret]) => {
                    if (ret.affectedRows == 1) {
                        const [[blocked]] = await User.getById(req.body.usr)
                        if ((parseInt(blocked.rating) - 5) >= 0)
                            await User.setFameRating((parseInt(blocked.rating) - 5), blocked.id_user)
                        res.status(200).send({ error: false })
                    }
                })
                .catch(e => {
                    if (e.message.split(' ')[0] === "Duplicate")
                        res.status(200).send({ error: "Already Blocked" })
                })
        }
        else
            res.status(200).send({ error: "cant report yourself" })
    } catch (error) {
        res.status(200).send({ error: "Something went Wrong! Please try Later" })
    }
}