require('dotenv').config()
const mongoose = require('mongoose')

const DB = process.env.MONGODB_URI

mongoose.connect(DB)

.then(() => {
    console.log('Database connected')
})

.catch((err) => {
    console.log('error connecting to database' + err.message)
    
})