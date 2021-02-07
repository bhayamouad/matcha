const History = require('../models/History')

exports.getHistory = (req, res) =>{
    History.getHistory(req.id_user)
    .then(([ret])=>{ 
        console.log(ret);
        res.status(200).send({data: ret, error: false}); 
    })
    .catch(e => {
        console.log(e.message);
        res.status(200).send({data: e.message, error: true}); 
    })
}