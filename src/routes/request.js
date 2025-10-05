const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();

// sending connection request - /sendConnectionRequest
requestRouter.post("/sendConnectionRequest",userAuth, async(req,res)=>{
    try {
        const user = req.user;
        
        res.send(user.firstName + " is sending Connection request")
    } catch (error) {
        res.status(400).send('ERROR: '+ error.message)
    }
})


module.exports = requestRouter;