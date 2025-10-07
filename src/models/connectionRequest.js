const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true
    }
}, {
    timestamps: true
});

connectionRequestSchema.pre("save",function(next){
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Cannot Send connection request to yourself");
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest",connectionRequestSchema);