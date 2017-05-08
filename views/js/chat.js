"use strict"
var Conversation = require('../../models/intermixconversation')
var User = require('../../models/intermixuser')

/*
 *  Returns all conversations for user
 */
exports.loadAllConversations = function (req, res, next) {
    Conversation.find({ participants: req.user.username })
        .sort({ updatedAt: 'desc' })
        .exec(function (err, conversations) {
            if (err) {
                res.send({ error: err })
                return next(err)
            }

            res.end(JSON.stringify(conversations))
        })
}

/*
 *  Loads messages for one conversation
 */
exports.loadConversation = function (req, res, next) {
    // console.log(req)
    console.log(JSON.stringify(req.body.participant1))
    console.log(JSON.stringify(req.body.participant2))
    Conversation.find({
        $and: [
            { participants: req.body.participant1 },
            { participants: req.body.participant2 }
        ]
    })
        .exec(function (err, con) {
            if (err) {
                res.send({ error: err })
                return next(err)
            }
            console.log(JSON.stringify(con))
            res.status(200).end(JSON.stringify(con))
        })
}

/*
 *  Creates a new conversation
 */
exports.createConversation = function (req, res, next) {
    if (!req.body.recipient) {
        res.status(422).send({ error: 'Please choose a valid recipient for your message.' })
        return next()
    }

    Conversation.count({
        $and: [
            { participants: req.user.username },
            { participants: req.body.recipient }
        ]
    })

        .exec(function (err, numCons) {
            if (numCons === 0) {
                if (!req.body.composedMessage) {
                    res.status(422).send({ error: 'Please enter a message.' })
                    return next()
                }

                const convers = new Conversation({
                    participants: [req.user.username, req.body.recipient]
                })

                convers.messages.push({
                    recipient: req.body.recipient,
                    composedMessage: req.body.composedMessage,
                    author: req.user.username
                })
                
                
                convers.save(function (err, newMessage) {
                    if (err) {
                        res.send({ error: err })
                        return next(err)
                    }

                    res.status(200).json({ message: 'Conversation started!' })
                    return next()
                })
            } else {
                console.log('Conversation exists')
                res.status(200).json({ message: 'Conversation exists!' })
                return
            }
        })
}

/*
 *  Sends a message
 */
exports.sendReply = function (req, res, next) {
    console.log("req.body below")
    console.log(req.body)
    Conversation.findOne({
        $and: [
            { participants: req.body.participant1 },
            { participants: req.body.participant2 }
        ]
    })
        .exec(function (err, convers) {
            if (err) {
                res.send({ error: err })
                return next(err)
            }

            var recipient_ = "";
            if (req.body.participant1 === req.user.username) {
                console.log(req.body.participant2)
                recipient_ = req.body.participant2;
            } else {
                console.log(req.body.participant1)
                recipient_ = req.body.participant1;
            }

            convers.messages.push({
                recipient: recipient_,
                composedMessage: req.body.composedMessage,
                author: req.user.username
            })

            convers.save(function (err, sentReply) {
                if (err) {
                    res.send({ error: err })
                    return next(err)
                }

                res.status(200).json({ message: 'Reply successfully sent!' })
                return next()
            })
        })
}