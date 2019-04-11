const User = require('../models/user')
const Joke = require('../models/joke')
const axios = require('axios');

class JokeController {
    
    //find random joke from API
    static findJoke (req,res) {
        console.log("masuk ke random joke")

        const headers = {'Accept': 'application/json'}
        axios.get('https://icanhazdadjoke.com/', {headers})
            .then(jokelist => {
                console.log("berhasil dapat", jokelist.data)
                res.status(200).json(jokelist.data)
            })
            .catch ((err) => {
                console.log("Terjadi error get random joke")
                res.status(500).json({
                    msg: 'ERROR get Joke: ',err
                })
            })
    }
    
    //make and save favorites joke by userId
    static create(req,res) {
        console.log("Cek Input", req.body, req.loggedInUser.id)
        Joke.create({
            content: req.body.content,
            jokeuserid: req.loggedInUser.id
        })
        .then(jokelist => {
            let newJoke = jokelist
            console.log("created", jokelist)
            return User.findOneAndUpdate({
                _id: jokelist.jokeuserid
            }, {$push: {listsJoke: jokelist._id}})
            .then(user => {
                console.log("Hasil push new joke:", user)
                res.status(200).json({
                    msg: 'Jokelist is successfully being favorited',
                    data: newJoke
                })
            })
            .catch(error => {
                res.status(500).json({
                    msg: 'ERROR create Joke: ',error
                })
            })
        })
    }

    //show favorites joke by userId
    static displayListJokeByUserId (req,res) {
        console.log("masuk ke display joke", req.loggedInUser)
        Joke.find({
            jokeuserid: req.loggedInUser._id
        })
        .then(jokelists => {
            console.log("User ditemukan, hasil pencarian user: ", jokelists)
            //get all jokes
            return Joke.find({})
            .then(lists => {
                console.log("Hasil pencarian joke: ", lists )
                res.status(201).json({
                    msg: `List Joke by user ${req.loggedInUser.email}`,
                    data: lists
                })
            })
        })
        .catch(error =>{
            res.status(500).json({
                msg: 'ERROR Display list of Joke ', error
            })
        })       
    }

    //remove and delete favorites joke by userId
    static deleteIndividualJoke(req,res) {
        console.log("masuk ke method dislike", req.params)
        Joke.findOne({
            _id: req.params.id
        })
        .then(jokelist =>{
            console.log("Joke yang akan diremove dan delete:", jokelist, req.loggedInUser)
            return User.findOneAndUpdate({
                _id:jokelist.jokeuserid
            }, {$pull: {listsJoke: jokelist._id}})
            .then(jokeToDelete => {
                console.log("Hasil update user untuk delete joke:", jokeToDelete)
                return Joke.findOneAndDelete({
                    _id: req.params.id
                })
                .then(jokeDelete => {
                    console.log("Hasil delete: ", jokeDelete)
                    res.status(200).json({
                        msg: 'Joke has been deleted',
                        data: jokeDelete
                    })
                })
            })
            .catch(error => {
                res.status(500).json({
                    msg: 'ERROR removing joke from user ',error
                })
            })
        })
        .catch( error =>{
            res.status(500).json({
                msg: 'ERROR finding joke to delete ',error
            })
        })
    }
}

module.exports = JokeController