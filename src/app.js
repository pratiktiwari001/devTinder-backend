const express = require('express');
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');

// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();

//middleware for converting json data into js object
app.use("/", express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


// DB connection
connectDB().then(() => {
    console.log("connected succesfully!!")
    port = 7777;
    app.listen(port, () => {
        console.log(`Server is Running at port http://127.0.0.1:${port}`);
    });
}).catch((err) => {
    console.log("Error in connecting the database!")
});
