const scoreModel = require('../models/score')
const userModel = require('../models/user')


exports.createScore = async (req, res) => {
    try {
        
        const { userId } = req.params

        const { punctuality, classAssessement, personalDefence, assignment, attendance} = req.body

        const user = await userModel.findById(userId)

        if(!user) {
            return res.status(404).json({message: 'student not found'})
        }

        const prevScores = await scoreModel.find({userId})

        const totalScore = punctuality + classAssessement + personalDefence + assignment + attendance

        const score = new scoreModel({
            week: prevScores.length + 1,
            punctuality, 
            classAssessement, 
            personalDefence, 
            assignment, 
            attendance,
            average: totalScore / 5,
            total: totalScore,
            name: user.fullName,
            userId
        })

        await score.save()

        res.status(200).json({message: 'score has been added successfully', data: score})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'internal server error'})
    }
}



exports.getAllScores = async (req, res) => {
    try {
        const scores = await scoreModel.find()

        res.status(200).json({message: 'all scores in the database', data:scores})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'internal server error'})
    }
}



exports.getAllScoresByASudent = async (req, res) => {
    try {
        
        const {userId} = req.user

        const user = await userModel.findById(userId)

        if(!user) {
            return res.status(404).json({message: 'student not found'})
        }

        const scores = await scoreModel.find({userId})

        res.status(200).json({message: `all scores for ${user.fullName}`, data: scores})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'internal server error'})
    }
}