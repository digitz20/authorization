const router = require('express').Router()

const { authenticate, authenticateAdmin } = require('../middleware/authentication')

const { createScore, getAllScoresByAStudent, getAllScores } = require('../controller/scoreController')

router.post('/assess/student/:userId' , authenticateAdmin, createScore)
router.get('/scores/student' , authenticate, getAllScoresByAStudent)
router.get('/all-scores' , authenticateAdmin, getAllScores)

module.exports = router