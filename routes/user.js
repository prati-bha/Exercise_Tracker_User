const router = require('express').Router();
const validate = require('validator');
const User = require('../models/user.model');
const auth = require('../middlewares/auth')

/**Check Unique Username */

const sendResponse = async (isUnique, res, req) => {
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
            await User.updateOne(req.user, { username: req.body.username }, {}, (err, data) => {
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
const checkUniqueNess = async (username, res, req) => {
    if (username === undefined) {
        res.status(400).send({
            message: 'username required !'
        });
    }
    if (username !== undefined) {
        await User.find({ "username": { $regex: username, $options: 'i' } }).countDocuments((err, count) => {
            if (err) {
                res.status(500);
            }
            if (!err) {
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
        await User.updateOne(req.user, {
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
/**Add Username Api */


/**Edit Username Api */
const checkUsername = (username) => {
    if (username === null) {
        return false
    }
    return true
}

const updateData = async (username, email, password, req, res) => {
    await User.updateOne(req.user, { username, email, password }, (err, data) => {
        if (err) {
            err => res.status(400).json('Error: ' + err)
        }
        if (!err) {
            res.status(200).send({
                message: "Data updated"
            })
        }
    })
}
router.post('/edit', auth, async (req, res) => {
    const isUsernameAdded = checkUsername(req.user.username);
    if (isUsernameAdded) {
        const email = req.body.email || req.user.email;
        const password = req.body.password || req.user.password;
        let username = req.user.username;
        try {
            if (req.body.username && req.body.username.length > 8) {
                res.status(400).send({
                    message: "Allowed username's length is only 8"
                })
            } else if (req.body.username && !validate.isAlphanumeric(req.body.username, 'en-US')) {
                res.status(400).send({
                    message: "Allowed username's content should be alphanumeric only"
                })
            } else if (req.body.username) {
                await User.find({ "username": { $regex: req.body.username, $options: 'i' } }).countDocuments((err, count) => {
                    if (err) {
                        res.status(500);
                    }
                    if (!err) {
                        if (count === 0) {
                            updateData(username, email, password, req, res)
                        } else {
                            res.status(405).send({
                                message: "username already taken !"
                            });
                        }
                    }
                })
            }
            if (!req.body.username) {
                updateData(username, email, password, req, res)
            }
        } catch (error) {
            res.status(400).send({
                message: error
            })
        }
    } else {
        res.status(400).send({
            message: "Add Username First"
        })
    }

});
/**Edit Username Api */

module.exports = router;