var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ConversationSchema = new Schema({
    participants: [String],
    messages: [{
        recipient: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        composedMessage: {
            type: String,
            required: true
        },
        createdAt: { 
            type: Date, 
            default: Date.now() 
        }
    }],
},{
    timestamps: true
})

var IntermixConversation = mongoose.model('IntermixConversation', ConversationSchema)

module.exports = IntermixConversation