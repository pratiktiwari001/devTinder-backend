const express = require('express');
const { userAuth } = require('../middlewares/auth');
// instance of express router
const profileRouter = express.Router();

// profile page - /profile
profileRouter.get("/profile",userAuth, async (req,res)=>{
    try {
        const user = req.user
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
});


module.exports = profileRouter;