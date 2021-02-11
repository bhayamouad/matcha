const History = require('../models/History')

exports.getHistory = (req, res) =>{
    // console.log(req.body) 
    History.getHistory(req.id_user, req.body.from, req.body.num)
    .then(([ret])=>{ 
        // console.log(ret);   
        res.status(200).send({data: ret, error: false}); 
    })
    .catch(e => {
        console.log(e.message);
        res.status(200).send({data: e.message, error: true}); 
    })
}