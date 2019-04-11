require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = {
    sign(user) {
        console.log("masuk sini jwt convert", user, process.env.JWT_SECRET)
        return jwt.sign(user, process.env.JWT_SECRET)
    },

    verify(token) {
        return jwt.verify(token, process.env.JWT_SECRET)
    }
}