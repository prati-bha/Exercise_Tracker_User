const router = require('express').Router();
const validate = require('validator');
const User = require('../models/user.model');
const auth = require('../middlewares/auth')

/**Check Unique Username */

const sendResponse = (isUnique, res, req) => {
    if (!isUnique) {
        res.status(405).send({
            message: "username already taken !"
        });
    }
    if (isUnique) {
        if (req.method === 'GET') {
            res.status(200).send({
                message: "username can be taken !"
            });
        }
        if (req.method === 'POST') {
            User.updateOne(req.user, { username: req.body.username }, {}, (err, data) => {
                if (err) {
                    res.status(400).json('Error: ' + err)
                }
                res.json({
                    message: "username added!"
                })
            })
        }
    }
}
const checkUniqueNess = (username, res, req) => {
    if (username === undefined) {
        res.status(400).send({
            message: 'username required !'
        });
    }
    if (username !== undefined) {
        User.find({ username }).countDocuments((err, count) => {
            if (err) {
                res.status(500);
            }
            if (req.method === 'GET') {
                sendResponse(!(count > 0), res, req);
            }
            if (req.method === 'POST') {
                sendResponse(!(count > 0), res, req);
            }
        })
    }
}

router.get('/username', auth, ((req, res) => {
    const username = req.query.username;
    try {
        checkUniqueNess(username, res, req);
    } catch (error) {
        res.status(404).send({
            message: error
        })
    }
}));

/**Check Unique Username */


/**Sign Up Api */
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

/** Login Api */
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

/** Logout Api */
router.get('/logout', auth, async (req, res) => {
    try {
        User.updateOne(req.user, {
            tokens: req.user.tokens.filter((token) => token.token !== req.token)
        }, (err, data) => {
            if (err) {
                res.status(500).json('Error: ' + err)
            }
            if (!err) {
                res.status(200).send({
                    message: "user logged out !"
                })
            }
        })
    } catch (error) {
        res.status(500).json('Error: ' + error)
    }
});
/**Add Username Api */
router.post('/username', auth, (req, res) => {
    const username = req.body.username;
    if (username && username.length > 8) {
        res.status(400).send({
            message: "Allowed username's length is only 8"
        })
    } else if (username && !validate.isAlphanumeric(username, 'en-US')) {
        res.status(400).send({
            message: "Allowed username's content should be alphanumeric only"
        })
    }
    try {
        checkUniqueNess(username, res, req)
    } catch (error) {
        res.status(400).send({
            message: error
        })
    }
});

module.exports = router;