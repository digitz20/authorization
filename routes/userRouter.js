const router = require('express').Router()

const { register, login, verifyEmail, resendVerificationEmail,resetPassword, forgotPassword, changePassword, makeAdmin } = require('../controller/userController')


router.post('/register', register)

router.post('/login', login)

router.get('/user-verify/:token', verifyEmail)

router.post('/resend-verification/email', resendVerificationEmail)

router.post('/resend-verification/forgotpassword', forgotPassword)

router.post('/resend-verification/resetpassword', resetPassword)

router.post('/resend-verification/changepassword/:userId', changePassword)

router.post('/makeuseradmin/:userid', makeAdmin)


module.exports = router