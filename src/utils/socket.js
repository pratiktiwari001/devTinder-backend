const socket = require("socket.io");
const crypto = require('crypto');

// Utility to create a unique, consistent room string for any two users
const getSecretRoom = (userId, targetUserId) => {
    return crypto.createHash("sha256")
        .update([userId, targetUserId].sort().join("_"))
        .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.BASE_URL,
            credentials: true, // Required since frontend uses { withCredentials: true }
        },
        path: '/socket.io/',
    });

    io.on("connection", (socket) => {
        // console.log("A user connected:", socket.id);

        // Handle User Joining the Chat Room
        socket.on("joinChat", ({ userId, targetUserId }) => {
            const room = getSecretRoom(userId, targetUserId);
            // console.log(`[Join] Users: ${userId} & ${targetUserId}`);
            // console.log(`[Join] Room ID: ${room}`);
            
            socket.join(room);
        });

        // Handle Sending Messages
socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
    const room = getSecretRoom(userId, targetUserId);
    // console.log(`[Message] ${firstName}: ${text}`);
    
    // 🚀 FIX: Change 'io.to' to 'socket.to'
    // This sends the message to the receiver, but DOES NOT echo it back to the sender
    socket.to(room).emit("messageReceived", { 
        firstName, 
        userId,  // <-- Make sure you pass userId back!
        text 
    });
});
        
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

module.exports = initializeSocket;