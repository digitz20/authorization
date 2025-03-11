const router = require('express').Router()

const { register, login, verifyEmail, resendVerificationEmail,resetPassword, forgotPassword, changePassword, makeAdmin } = require('../controller/userController')

const jwt = require('jsonwebtoken')
const passport = require('passport')




router.post('/register', register)

router.post('/login', login)

router.get('/user-verify/:token', verifyEmail)

router.post('/resend-verification/email', resendVerificationEmail)

router.post('/resend-verification/forgotpassword', forgotPassword)

router.post('/resend-verification/resetpassword', resetPassword)

router.post('/resend-verification/changepassword/:userId', changePassword)

router.post('/makeuseradmin/:userid', makeAdmin)

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/auth/google/callback', passport.authenticate('google'), async (req, res) => {

    // console.log(req.user)
    const token = await jwt.sign({userId: req.user._id}, process.env.JWT_SECRET, { expiresIn: "1day" })
    res.status(200).json({message: 'Authentication succesful', token, user: req.user})
})
// router.get("/", (req, res)=> {
//     res.send("successful")
// })

module.exports = router


