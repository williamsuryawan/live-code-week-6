require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Joke = require('../models/joke')

module.exports = {
    Authentication: function (req,res, next) {
    if(req.headers.hasOwnProperty('access_token')) {
        console.log("Masuk verifikasi JWT", req.headers.hasOwnProperty('access_token'))
        try {
            console.log("Cek ENV", process.env.JWT_SECRET)
            const decoded = jwt.verify(req.headers.access_token, process.env.JWT_SECRET)
            console.log("Hasil verifikasi JWT", decoded)
            if (decoded != null) {
                User.findOne({
                    email: decoded.email
                })
                .then(user => {
                    req.loggedInUser = user
                    next()
                })
            }
        } catch (err) {
            res.status(400).json({
                message: 'Invalid Token'
            })
        }
    } else {
        res.status(400).json({
            message: 'Please provide token'
        })
    }
    },
    Authorization: function(req, res, next) {
        console.log("Input Authorization to delete joke", req.loggedInUser, req.params.id)
        Joke.findOne({
            _id: req.params.id
        })
        .then(foundjoke => {
            console.log("joke ditemukan dalam authorization", foundjoke)
            if(req.loggedInUser._id.toString() == foundjoke.jokeuserid.toString()) {
                next()
            } else {
                res.status(401).json({
                    message: "You dont have any authorization"
                })
            }
        })
        
    }
}