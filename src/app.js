const express = require('express');
const connectDB = require("./config/database");
const User = require('./models/user')


// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();

//creating new instance of user model
app.post("/signup",async (req,res)=>{
const user = new User({
      firstName : "Virat",
      lastName : "Kohli",
      emailID : "virat@kohli.com",
      age : 36,
      gender : "male"  
    });

await user.save();
res.send("data saved")
})

connectDB().then(()=>{
    console.log("connected succesfully!!")
    port = 7777;
    app.listen(port,()=>{
    console.log(`Server is Running at port http://127.0.0.1:${port}`);
});
}).catch((err)=>{
    console.log("Error in connecting the database!")
});
