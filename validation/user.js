const joi = require('joi')

exports.registerSchema = joi.object().keys({
    fullName: joi.string().min(3).max(27).required(),
    username: joi.string().min(3).max(27).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required(),
    gender: joi.string().trim().valid('Male','Female').required()
   
})


exports.loginSchema = joi.object().keys({
    email: joi.string().trim().min(6).email().required(),
    password: joi.string().trim().required(),
    username: joi.string().min(3).max(27).required()

})


exports.verificationEmailSchema = joi.object().keys({
    email: joi.string().trim().min(6).email().required(),

})
