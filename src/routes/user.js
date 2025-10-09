const express = require('express');
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')
const userRouter = express.Router();

const requiredInfo = "firstName lastName age gender photoUrl"

// Get all the pending connection request for loggedIn user
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id, status: "interested"
            // }).populate("fromUserId",["firstName","lastName"]);
        }).populate("fromUserId", requiredInfo);

        if (!pendingRequests) {
            return res.status(404).json({ message: "No pending requests" })
        }

        res.json({ message: "Data fetched Successfully", data: pendingRequests })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})


// get the user connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: 'accepted' },
                { fromUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate("fromUserId", requiredInfo).populate("toUserId", requiredInfo)

        if (!connectionRequests) {
            return res.status(400).json({ message: "You have no connections" })
        }
        const data = connectionRequests.map((connection) => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return connection.toUserId
            }
            return connection.fromUserId
        })

        res.json({ data: data })

    } catch (error) {
        res.status(400).send("ERROR: ")
    }
})


//user feed
userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId")

        // res.json(connectionRequests);

        const hiddenUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hiddenUsersFromFeed.add(req.toUserId.toString());
            hiddenUsersFromFeed.add(req.fromUserId.toString());
        })

        const usersInFeed = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }]
        }).select(requiredInfo).skip(skip).limit(limit)

        res.json({ FEED: usersInFeed })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

module.exports = userRouter;