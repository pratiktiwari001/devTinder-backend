const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateProfileEditData } = require('../utils/validation')
const bcrypt = require('bcrypt')
const validator = require('validator')
// instance of express router
const profileRouter = express.Router();

// profile page
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
});

// profile edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        if (!validateProfileEditData(req)) {
            throw new Error("UPDATE not allowed");
        }

        Object.keys(req.body).forEach((key) =>{ loggedInUser[key] = req.body[key]});
        await loggedInUser.save();

        res.json({message: "User Updated Successfully",data: loggedInUser})

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

// profile edit password
profileRouter.patch("/profile/password",userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const{oldPassword,newPassword} = req.body;
        const isOldPasswordValid = await bcrypt.compare(oldPassword,loggedInUser.password);
        if(!isOldPasswordValid){
            throw new Error("Incorrect password")
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Password is too weak");
        }
        const passwordHash = await bcrypt.hash(newPassword,10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();

        res.json({message: "Password Updated Successfully"})

    } catch (error) {
        res.status(400).send("ERROR: "+ error.message)
    }
})

module.exports = profileRouter;