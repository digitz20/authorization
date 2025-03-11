const mongoose = require('mongoose')


const scoreSchema = new mongoose.Schema({
    week: { type: Number, required: true },
    punctuality: { type: Number, required: true },
    assignment: { type: Number, required: true },
    attendance: { type: Number, required: true },
    classAssessment: { type: Number, required: true },
    personalDefence: { type: Number, required: true },
    total: { type: Number, required: true },
    average: { type: Number, required: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Users', required: true},
    name: { type: String, required: true }

}, { timestamps: true})

const scoreModel = mongoose.model('Scores', scoreSchema)

module.exports = scoreModel