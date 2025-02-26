const userModel = require('../models/user')
const jwt = require('jsonwebtoken')

exports.authenticate = async (req, res, next) => {
    try {

        const auth = req.headers.authorization

        if(!auth) {
            return res.status(400).json({message: 'token not found'})
        }

        const token = auth.split(' ')[1]
        if(!token) {
            return res.status(400).json({message: 'invalid token'})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decodedToken.userId)
        if(!user) {
            return res.status(400).json({message: 'authentication failed: user not found'})
        }
        req.user = decodedToken

        next()
        
    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'session timed out, please login to continue'})
        }
    }
    res.status(500).json({message: 'internal server error'})
}




exports.authenticateAdmin = async (req, res, next) => {
    try {

        const auth = req.headers.authorization

        if(!auth) {
            return res.status(400).json({message: 'token not found'})
        }

        const token = auth.split(' ')[1]
        if(!token) {
            return res.status(400).json({message: 'invalid token'})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decodedToken.userId)
        if(!user) {
            return res.status(400).json({message: 'authentication failed: user not found'})
        }

        if(user.isAdmin === false) {
            return res.status(401).json({message: 'unauthorized: you are not allowed to perform this action'})
        }
        req.user = decodedToken

        next()
        
    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'session timed out, please login to continue'})
        }
    }
    res.status(500).json({message: 'internal server error'})
}