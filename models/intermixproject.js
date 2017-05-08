var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Project = new Schema ({
    projectName: {
        type: String,
        required: true
    },
    projectLeader: {
        type: String,
        required: true
    },
    projectLeaderEmail: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    teamMembers: [ String ],
    projectSkills: [ String ],
    createdAt: { type: Date, default: Date.now() }
})

var IntermixProject = mongoose.model('IntermixProject', Project)

module.exports = IntermixProject
