const Like = require('../models/Like')
exports.like = (req, res) => {
    Like.add(req.id_user, req.body.idLiked).then(() => {
        res.send({message:"liked success"})
    }).catch(err => console.log(err.message))
}