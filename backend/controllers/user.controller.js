//status code
//200-OK
//403-related to db uses like duplicate and not found
//405-Exception

const mongoose = require('mongoose');
const _ = require('lodash');

const User = mongoose.model('User');

//Login and registration

module.exports.register = (req, res, next) => {
    try {
        console.log(req.body)
        var user = new User();
        user.fullName = req.body.fullname;
        user.email = req.body.email;
        user.password = req.body.password;
        user.save((err, doc) => {
            if (err) {
                if (err.code == 11000)
                    res.status(403).json({ 
                        "status": 'Invalid', 
                        "message": 'Duplicate email adrress found.',
                        "token": "null"  
                });
                else
                    return next(err);
            }
            else {
                //here token is generated for any api process after registration
                return res.status(200).json({ 
                        "status": 'valid', 
                        "message": 'Registered successfully',
                        "token": user.generateJwt()  
                });
            }

        });
    }
    catch (ex) {
        return res.status(405).send({ msg: ex.message });
    }
}

module.exports.authenticate = async (req, res, next) => {
    try {
        console.log(req.body)
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(403).json(
            { msg: 'The email address ' + email + ' is not associated with any account. Double-check your email address and try again.' });

        //validate password
        if (!user.verifyPassword(password)) return res.status(403).json({ 
            "status": 'Invalid', 
            "message": 'Invalid email or password',
            "token":  "null" });
        // Make sure the user has been verified

        if (user) return res.status(200).json({ 
            "status": 'valid', 
            "message": 'Verified email and password',
            "token": user.generateJwt() });

    }
    catch (ex) {
        return res.status(405).send({ msg: ex.message });
    }
}
