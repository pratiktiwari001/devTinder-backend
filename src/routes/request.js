const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const requestRouter = express.Router();

// sending connection request - /sendConnectionRequest
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })
        }

        const toUser = await User.findById({ _id: toUserId });
        if (!toUser) {
            return res.status(400).json({ message: "User does not exist" })
        }

        const isConnectionAllowed = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (isConnectionAllowed) {
            return res.status(400).json({ message: "Connection Request already exists" })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })

        const connectionData = await connectionRequest.save();

        res.json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data: connectionData
        })

    } catch (error) {
        res.status(400).send('ERROR: ' + error.message)
    }
})

// review connection request - /reviewConnectionRequest
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(404).json({ message: "Invalid Status" })
        }

        const connection = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })

        if (!connection) {
            return res.status(404).json({ message: "Connection Request not found" })
        }

        connection.status = status;
        await connection.save();

        res.json({ message: `Connection request ${status} successfully`, data: connection })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})


module.exports = requestRouter;