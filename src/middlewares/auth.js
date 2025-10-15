const jwt = require('jsonwebtoken');
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {//Read the token from the req cookies
        const { token } = req.cookies;
        if(!token){
            return res.status(401).send("Please Login!")
        }

        //Validate the token
        const decodedToken = await jwt.verify(token, "DEV@tinder123")

        //Find the user
        const { _id } = decodedToken;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user
        next();
    }
    catch (error) {
        res.status(400).send("ERROR: "+ error.message)
    }

}

module.exports = { userAuth };