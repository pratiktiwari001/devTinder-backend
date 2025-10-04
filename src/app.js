const express = require('express');
const connectDB = require("./config/database");
const User = require('./models/user');
const { isValidData } = require('./utils/validation');
const bcrypt = require('bcrypt')
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const { userAuth } = require('./middlewares/auth');
const user = require('./models/user');


// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();

//middleware for converting json data into js object
app.use("/", express.json());
app.use(cookieParser())

//creating new instance of user model 
// post api - /signup
app.post("/signup", async (req, res) => {

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
app.post("/login", async (req, res) => {
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
        const passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck) {
            throw new Error("Invalid Credentials");
        }

        //create a JWT Token
        const token = await jwt.sign({_id: user._id},"DEV@tinder123",{expiresIn: '1d'});

        // Add the token to the cookie and send the response back to the user
        res.cookie("token",token,{expires: new Date(Date.now() + 8 *3600000)})

        res.send("LOGIN SUCCESSFUL");
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

// profile page - /profile
app.get("/profile",userAuth, async (req,res)=>{
    try {
        const user = req.user
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// sending connection request - /sendConnectionRequest
app.post("/sendConnectionRequest",userAuth, async(req,res)=>{
    try {
        const user = req.user;
        
        res.send(user.firstName + " is sending Connection request")
    } catch (error) {
        res.status(400).send('ERROR: '+ error.message)
    }
})


connectDB().then(() => {
    console.log("connected succesfully!!")
    port = 7777;
    app.listen(port, () => {
        console.log(`Server is Running at port http://127.0.0.1:${port}`);
    });
}).catch((err) => {
    console.log("Error in connecting the database!")
});
