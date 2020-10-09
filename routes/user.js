const router = require('express').Router();
const validate = require('validator');
const User = require('../models/user.model');
const auth = require('../middlewares/auth')

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});
const sendResponse = (isUnique, res) => {
    if (isUnique) {
        res.status(200).send({
            message: "username can be taken !"
        });
    }
    if (!isUnique) {
        res.status(405).send({
            message: "username already taken"
        });
    }
}
const checkUniqueNess = (usernameToCheck, users, res) => {
    if (usernameToCheck === undefined) {
        res.status(400).send({
            message: 'username required'
        });
    }
    if (usernameToCheck !== undefined) {
        const usedUsernames = users.filter((user) => {
            if (usernameToCheck.toLowerCase() === user.username.toLowerCase()) {
                return user
            }
        });
        sendResponse(!(usedUsernames.length > 0), res);
    }
}
router.route('/username').get((req, res) => {
    const username = req.query.username;
    User.find()
        .then(users => {
            checkUniqueNess(username, users, res);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//signUp api
router.route('/signUp').post(async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = new User({
            email,
            password,
        });
        user.save().then(() => {
            res.status(200).send({
                user,
            })
        }).catch(err => res.status(400).json('Error: ' + err));
    } catch (error) {
        res.status(500).json('Error: ' + error)
    }

});

//login api
router.route('/login').post(async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.status(200).send({
            user,
            token
        })
    } catch (error) {
        res.status(500).json('Error: ' + error)
    }

});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    if (username.length > 8) {
        res.status(400).send({
            message: "Allowed username's length is only 8"
        })
    } else if (!validate.isAlphanumeric(username, 'en-US')) {
        res.status(400).send({
            message: "Allowed username's content should be alphanumeric only"
        })
    }
    else {
        const newUser = new User({ username });
        newUser.save()
            .then(() => res.json('User added!'))
            .catch(err => res.status(400).json('Error: ' + err));
    }
});

module.exports = router;