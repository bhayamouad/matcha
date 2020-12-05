exports.register = (req,res) => {
        res.send({message:`hello ${req.body.login} your account was created try to login with this ${req.body.email}:${req.body.password}`})
    }

exports.login = (req,res) => {
    if(req.body.login === 'mbhaya' && req.body.password === '123456')
        res.send({message:`hello ${req.body.login} your are logged in with ${req.body.email}:${req.body.password}`})
    else
        res.send({message:`Error try to login`})
}