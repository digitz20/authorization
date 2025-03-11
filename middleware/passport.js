
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user');
const passport = require('passport')


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:  process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4805/api/v1/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    // console.log(profile)
   try {
    const checkUser = await userModel.findOne({ email: profile.emails[0].value })

    if(!checkUser) {
        const newUser = new userModel({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            isVerified: profile.emails[0].verified,
            isAdmin: false,
            profileId: profile.id
            

        })
        await newUser.save()
    
    }
   return cb(null, checkUser)

   } catch (error) {
    return cb(error, null)
   }
  }
));




passport.serializeUser((user, cb)=> {
    cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
    await userModel.findById(id)
    cb(null, user)
})
 
