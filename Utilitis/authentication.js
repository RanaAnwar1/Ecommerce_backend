const { request } = require('http')
const jwt = require('jsonwebtoken')
const secretKey = 'HM^u~&6li/AK#yFb$"nKZ_jt*Swhb&VCOM",bXn>P7/"Uqz&mVK0P}EwsIceOhI'

exports.createToken = (data)=>{
    return jwt.sign(data, secretKey,{expiresIn: '1h'})
}

exports.authMW = (req,res,next)=>{
    const token = req.header('Authorization')?.replace('Bearer ','')
    try{
        if(!token){
            return res.status(401).json({error : 'Access Denied : token missing'})
        }
        const verifed = jwt.verify(token,secretKey)
        req.user = verifed
        next()
    }
    catch(err){
        res.status(500).json({error : err.message})
    }
}