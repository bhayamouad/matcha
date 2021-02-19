const Like = require('../models/Like')
const Match = require('../models/Match')
const User = require('../models/User')

exports.like = (req, res) => {
    Like.add(req.id_user, req.body.idLiked).then( async () => {
        const [check] = await Like.getLikesByLikedId(req.body.idLiked, req.id_user)
        if(check.length){
            Match.add(req.body.idLiked, req.id_user)  
                .then(()=>{
                    res.send({message:"its a match"})
                })
                .catch(err => console.log(err.message))
        }
        else
            res.send({message:"like"})
    }).catch(err => console.log(err.message))
}

exports.reject = (req, res) => {
    Like.dislike(req.id_user, req.body.idDisliked).then(() => {
        res.send({message:"disliked success"})
    }).catch(err => console.log(err.message))
}

exports.getMore = async (req, res) => {
    const {ageGap, rateGap, distance, tags} = req.body
    const search = {ageGap, rateGap, distance, tags} 
    try {
        const [moreUsers] = await User.getUserPosImgSearch(req.id_user, search)
        res.send({users:moreUsers}) 
    } catch (error) {
        console.log(error.message);
    }

}