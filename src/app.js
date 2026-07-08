const express = require('express');
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require("http");
require('dotenv').config();
require("./utils/cronjob");

// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();

app.use(cors({
    origin: ["https://developerstinder-devtinder.vercel.app", "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], 
}));

//middleware for converting json data into js object
app.use("/", express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const initializeSocket = require('./utils/socket');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

const server = http.createServer(app)
initializeSocket(server);

// DB connection
connectDB().then(() => {
    console.log("connected succesfully!!")
    port = process.env.PORT;
    server.listen(port, '0.0.0.0', () => {
        console.log(`Server is Running at port http://localhost:${port}`);
    });
}).catch((err) => {
    console.log("Error in connecting the database!")
});
