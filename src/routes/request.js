const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

// Send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `Invalid status type: ${status}`,
        });
      }

      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).json({
          message: "You cannot send a request to yourself",
        });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({
          message: "User does not exist",
        });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(409).json({
          message: "Connection Request already exists",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const connectionData = await connectionRequest.save();

      return res.status(201).json({
        message:
          status === "interested"
            ? `Connection request sent to ${toUser.firstName}`
            : `${toUser.firstName} removed from your feed`,
        data: connectionData,
      });
    } catch (error) {
      console.error("Send request error:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

// Review connection request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const connection = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connection) {
        return res.status(404).json({
          message: "Connection Request not found",
        });
      }

      connection.status = status;
      await connection.save();

      return res.json({
        message: `Connection request ${status} successfully`,
        data: connection,
      });
    } catch (error) {
      console.error("Review request error:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = requestRouter;