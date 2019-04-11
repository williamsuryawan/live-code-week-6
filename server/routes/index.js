// Routes Joke William
const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController')
const JokeController = require('../controllers/jokeController');
const {Authentication, Authorization} = require('../middlewares/authentication.js')


// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/user', UserController.findAll)
router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.get('/jokes', JokeController.findJoke)
router.use(Authentication)
router.get('/myjokes', JokeController.displayListJokeByUserId)
router.post('/jokes', JokeController.create);
router.delete('/jokes/:id', Authorization, JokeController.deleteIndividualJoke)

module.exports = router;