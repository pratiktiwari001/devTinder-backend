const socket = require("socket.io");
const crypto = require('crypto')

const getSecretRoom = (userId, targetUserId)=>{
    return crypto.createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex")
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
        path: '/socket.io/',
    });

    io.on("connection", (socket) => {

        socket.on("joinChat", ({ userId, targetUserId }) => {
            const room = getSecretRoom(userId, targetUserId);
            console.log(`Received joinChat: ${userId} and ${targetUserId}`);
            console.log(`Joining room: ${room}`);
            socket.join(room)
        });

        socket.on("sendMessage", ({firstName, userId, targetUserId, text}) => {
            const room = getSecretRoom(userId, targetUserId);
            console.log(firstName+" "+text)
            io.to(room).emit("messageReceived", {firstName, text})
        });
        
        socket.on("disconnect", () => {});
    })
}

module.exports = initializeSocket;