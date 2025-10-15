const express = require('express');
const { isValidData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const validator = require('validator');

// instance of express router
const authRouter = express.Router();

//creating new instance of user model 
// signup api
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

        // check whether email already exists in DB
        const userExist = await User.findOne({emailID: emailID});
        if(userExist){
            throw new Error("This Email is already in use")
        }

        //saving user to DB
        await user.save();
        res.send("data saved")
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
});

// login api
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
        res.cookie("token", token, { expires: new Date(Date.now() + 7 * 86400000), httpOnly: true, })

        res.send(user);
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

// logout api
authRouter.post("/logout", async (req, res) => {
    //cleaning activities and expiring cookies
    res.cookie("token", null, { expires: new Date(Date.now()) })
    res.send("LOGOUT Successful");

})


module.exports = authRouter;