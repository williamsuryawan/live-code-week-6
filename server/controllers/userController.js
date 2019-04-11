// User Controller for Joke William
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwtConvert = require('../helpers/jwtConvert')

class UserController {
    static findAll (req,res) {
        console.log("masuk ke finduser")
        User
            .find({})
            .populate('listsJoke')
            .then(result => {
                res.status(200).json(result)
            })
            .catch (err => {
                res.status(500).json({
                    message: "Internal server error"
                })
            })
    }

    static register (req,res) {
        console.log("masuk ke register", req.body)
        User
            .create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            .then(newUser => {
              res.status(201).json(newUser);
            })
            .catch(err => {
              console.log("terjadi error add users", err)  
              if (err.errors.email) {
                    res.status(409).json(err);
                } else if(err.errors.phone) {
                    res.status(409).json(err);
                } else {
                    res.status(500).json(err);
                }
            }) 
    }


    static login (req, res) {
    console.log("Masuk ke login via website, input:", req.body)
    User
        .findOne({
            email: req.body.email
        })
        .then(user => {
            if(!user) {
                res.status(400).json({
                    message: `Wrong Email/Password`
                })
            } else {
                console.log("User berhasil ditemukan ====>", user)
                let isValid = bcrypt.compareSync(req.body.password, user.password)
                console.log("Cek validity==>", isValid)
                if(isValid) {
                    let token = jwtConvert.sign({email: user.email})
                    console.log("Token dihasilkan:", token)
                    res.status(201).json({
                        access_token: token
                    })
                } else {
                    res.status(400).json({
                        message: 'Wrong Email/Password'
                    })
                }
            }

        })
    }
}

module.exports = UserController