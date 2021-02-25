const Like = require('../models/Like')
const Match = require('../models/Match')
const User = require('../models/User')
const Notification = require('../models/Notification')

exports.like = (req, res) => {
    try {
        Like.add(req.id_user, req.body.idLiked)
            .then( async () => {
                const [[liker]] = await User.getById(req.id_user)
                const [[liked]] = await User.getById(req.body.idLiked)
                if ((parseInt(liker.rating) + 1) <= 100)
                    await User.setFameRating((parseInt(liker.rating) + 1), liker.id_user)
                if ((parseInt(liked.rating) + 5) <= 100)
                    await User.setFameRating((parseInt(liked.rating) + 5), liked.id_user)
                const [check] = await Like.isLiked(req.body.idLiked, req.id_user)
                if(check.length){
                    await Notification.push('match', liker.id_user, liked.id_user)
                    Match.add(req.body.idLiked, req.id_user)
                        .then(()=>{
                            res.send({message:"its a match"})
                        })
                        .catch(err => console.log(err.message)) 
                }
                else{
                    await Notification.push('like', liker.id_user, liked.id_user)
                    res.send({message:"like"})
                }
            }).catch(err => console.log(err.message))
    } catch (error) {
        res.status('201').send({ message: 'Something went Wrong! Please try Later', error: true } )
    }
}

exports.unLike = (req, res) => {
    try {
        Like.delete(req.id_user, req.body.idLiked)
            .then( async () => {
                const [[checkMatch]] = await Match.getMatchesByUsers(req.id_user,req.body.idLiked)
                if(checkMatch){
                    await Notification.push('dislike', req.id_user, req.body.idLiked)
                    await Match.delete(req.id_user, req.body.idLiked)
                }
                res.send({message:"unLike"})
            })
            .catch(err => console.log(err.message))
    } catch (error) {
        res.status('201').send({ message: 'Something went Wrong! Please try Later', error: true } )
    }
}

exports.reject = (req, res) => {
    Like.reject(req.id_user, req.body.idDisliked).then(() => {
        res.send({message:"reject success"})
    }).catch(err => console.log(err.message))
}

exports.getSuggestedUser = (req, res) => {
    User.getUsersPosImg(req.id_user)
        .then( ([users]) => {
            res.status(200).send({users})
        }) 
        .catch(err => console.log(err.message))
}

exports.getSearchedUser = async (req, res) => {
    const {ageGap, rateGap, distance, tags} = req.body
    const search = {ageGap, rateGap, distance, tags} 
    try {
        const [moreUsers] = await User.getUserPosImgSearch(req.id_user, search)
        res.send({users:moreUsers}) 
    } catch (error) {
        console.log(error.message);
    }

}