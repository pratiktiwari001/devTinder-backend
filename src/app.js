const express = require('express');
const connectDB = require("./config/database");
const User = require('./models/user')


// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();

//middleware for converting json data into js object
app.use("/",express.json());


//creating new instance of user model
app.post("/signup",async (req,res)=>{
console.log(req.body);
const user = new User(req.body);

try {
    await user.save();
    res.send("data saved")  
} catch (error) {
    res.status(400).send("Error sending the user: "+error.message)
}
});

connectDB().then(()=>{
    console.log("connected succesfully!!")
    port = 7777;
    app.listen(port,()=>{
    console.log(`Server is Running at port http://127.0.0.1:${port}`);
});
}).catch((err)=>{
    console.log("Error in connecting the database!")
});
