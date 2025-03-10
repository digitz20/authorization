const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const sendEmail = require('../middleware/nodemailer')
const jwt = require('jsonwebtoken')
const { signUpTemplate, forgotTemplate } = require('../utils/mailTemplates')
const {validate} = require('../helper/utilities')
const {registerSchema, loginSchema, verificationEmailSchema} = require('../validation/user')



exports.register = async (req, res) => {
    try {
        
        const validated = await validate(req.body , registerSchema)
        
        const {fullName, email, gender, password, username } = validated

        const user = await userModel.findOne({ email: email.toLowerCase()})

        if(user) {
            return res.status(400).json({message: `user with email: ${email} already exists`})
        }

        const usernameExists = await userModel.findOne({ username: username.toLowerCase()})

        if(usernameExists) {
            return res.status(400).json({message: 'username has been taken'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            fullName,
            email,
            password: hashedPassword,
            gender,
            username
        })

        const token = await jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET, { expiresIn: '1day'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = newUser.fullName.split(' ')[1]


        const mailDetails = {
            subject: 'Welcome Email',
            email: newUser.email,
            html : signUpTemplate(link, firstName)
        }

        await sendEmail(mailDetails)

        await newUser.save()

        res.status(201).json({message: 'user registered successfully', data: newUser, token})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'internal server error',  error: error.message})
        
    }
}




exports.login = async (req, res) => {
    try {
        const validated = await validate(req.body , loginSchema)

        const {email, password, username} = validated

        if(!email && !username) {
            return res.status(400).json({message: 'please enter either email or username'})    
        }

        if(!password) {
            return res.status(400).json({message: 'please enter your password'})    
        }

        const user = await userModel.findOne({ $or: [{ email}, {username: username.toLowerCase()}]})

        if(user === null) {
            return res.status(404).json({message: 'user not found'})  
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(isPasswordCorrect === false) {
            return res.status(400).json({message: 'incorrect password'})  
        }

        if(user.isVerified === false) {
            return res.status(400).json({message: 'account not verified, please check your email for link'})  
        }


        const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn:'1day'})

        res.status(200).json({message: 'login successful', data: user, token})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'internal server error' , error: error.message})
    }
}





exports.verifyEmail = async (req, res) => {
    try {
        
        const {token}  = req.params

        if(!token) {
            return res.status(400).json({message: 'token not found'})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decodedToken.userId)

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        if(user.isVerified === true) {
            return res.status(400).json({message: 'user has already been verified'})
        }

        user.isVerified = true

        await user.save()

        res.status(200).json({message: 'user verified successfully'})


    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'verification link expired'})
        }
    }
    res.status(500).json({message: 'error verifying user:' + error.message})
}




exports.resendVerificationEmail = async (req, res) => {
    try {
        
        const validated = await validate(req.body , verificationEmailSchema)

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const user = await userModel.findOne({email: email.toLowerCase()})

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        const token = await jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: '1h'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = user.fullName.split('')[1]

        const html = signUpTemplate(link, firstName)

        const mailOptions = {
            subject: 'email verification',
            email: user.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'verification email sent, please check mail box'})


    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error resending verification email' + error.message})
    }
}




exports.forgotPassword = async (req, res) => {
    try {
        const {email} = req.params

        if(!email) {
            return res.status(400).json({message: 'please input your email'})
        }

        const user = await userModel.findOne({email: email.toLowerCase()})

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        const token = await jwt.sign({userId : user._id}, process.env.JWT_SECRET, {expires : '10mins'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/recovery-password/${token}`

        const firstName = user.fullName.split(' ')[0]

        const mailDetails = {
            subject: 'password reset',
            email: user.email,
            html: forgotTemplate(link, firstName)
        }

        await sendEmail(mailDetails)

        res.status(200).json({message: 'password reset initiated,please check link for the reset link'})

        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'internal server error' + error.message})
    }
}




exports.resetPassword = async (req, res) => {
    try {
        
        const {token} = req.params

        const {password, confirmPassword} = req.body

        const {userId} = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(userId)

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        if(password !== confirmPassword) {
            return res.status(400).json({message: 'password does not match'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user.password = hashedPassword

        await user.save()

        res.status(200).json({message: 'password reset successful'})


    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'verification link expired'})
        }
    }
    res.status(500).json({message: 'internal server error' + error.message})
}




exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body

        const {userId} = req.params

        const user = await userModel.findById(userId)

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }


        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)

        if(!isPasswordCorrect) {
            return res.status(400).json({message: 'enter your correct pasword'})
        }

        if(newPassword !== confirmPassword) {
            return res.status(400).json({message: 'passwords do not match'})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword

        await user.save()

        res.status(200).json({message: 'password has been changed successfully'})


    } catch (error) {
        res.status(500).json({message: 'internal server error' + error.message})
}
}




exports.makeAdmin = async (req, res) => {
    try {
        
        const {userId} = req.params

        const user = await userModel.findById(userId)

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        if(user.isAdmin === true) {
            return res.status(400).json({message: 'user is already an admin'})
        } 

        user.isAdmin = true

        await user.save()

        res.status(200).json({message: 'user has been made an admin', data: user})
        
    } catch (error) {
        res.status(500).json({message: 'internal server error' + error.message})
    }
}

