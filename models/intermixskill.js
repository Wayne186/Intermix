var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Skill = new Schema({
    skillName: {
        type: String,
        required: true
    },
    skillCount: {
        type: Number,
        required: true,
        default: 0
    }
})

var IntermixSkill = mongoose.model('IntermixSkill', Skill)

module.exports = IntermixSkill

