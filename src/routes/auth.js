const express = require('express');
const { isValidData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validator = require('validator');

// instance of express router
const authRouter = express.Router();

//creating new instance of user model 
// post api - /signup
authRouter.post("/signup", async (req, res) => {

    try {
        //Validate User Data
        isValidData(req);
        const { firstName, lastName, emailID, password } = req.body;

        //Hashing the PASSWORD
        const passwordHash = await bcrypt.hash(password, 10);

        //creating new Instance of User Model
        const user = new User({
            firstName,
            lastName,
            emailID,
            password: passwordHash
        });
        //saving user to DB
        await user.save();
        res.send("data saved")
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
});

// login api - /login
authRouter.post("/login", async (req, res) => {
    try {
        const { emailID, password } = req.body;
        if (!validator.isEmail(emailID)) {
            throw new Error("Invalid Credentials");
        }
        
        //finds user with the emailID
        const user = await User.findOne({ emailID: emailID });
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        //compares password given by user to the password stored in DB
        const validity = await user.passwordCheck(password);
        if (!validity) {
            throw new Error("Invalid Credentials");
        }

        //create a JWT Token
        const token = await user.createToken();

        // Add the token to the cookie and send the response back to the user
        res.cookie("token",token,{expires: new Date(Date.now() + 7 * 86400000)})

        res.send("LOGIN SUCCESSFUL");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})


module.exports = authRouter;