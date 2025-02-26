const router = require('express').Router()

const { register, login, verifyEmail, resendVerificationEmail,resetPassword, forgotPassword } = require('../controller/userController')


router.post('/register', register)

router.post('/login', login)

router.get('/user-verify/:token', verifyEmail)

router.post('/resend-verification/email', resendVerificationEmail)

router.post('/resend-verification/forgotpassword', forgotPassword)

router.post('/resend-verification/resetpassword', resetPassword)


module.exports = router