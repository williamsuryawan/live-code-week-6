const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jokeSchema = new Schema ({
    content: {type: String},
    jokeuserid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Jokelist = mongoose.model('Jokelist', jokeSchema)

module.exports = Jokelist