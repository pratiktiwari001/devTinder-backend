const express = require('express');
const connectDB = require("./config/database");
const User = require('./models/user')


// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();

//middleware for converting json data into js object
app.use("/",express.json());

//getting users with filtered mail ID
app.get("/users",async (req,res)=>{
    const userMail = req.body.emailID;
    try {
        const users = await User.find({emailID : userMail});
        if(users.length === 0){
            res.status(404).send("No user found!!")
        } else{
        res.send(users);}
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

// feed api - /feed
app.get("/feed",async (req,res)=>{
    try {
       const users = await User.find({});
       if(users.length === 0){
            res.status(404).send("No user found!!")
        } else{
        res.send(users);}
    } catch (error) {
        res.status(400).send("Some error occured!")
    }
})

// get -findById
app.get("/feed/id",async (req,res)=>{
    try {
       const user = await User.findById('68db8720ec3c56e61548a428');
       if(!user){
            res.status(404).send("No user found!!")
        } else{
        res.send(user);}
    } catch (error) {
        res.status(400).send("Some error occured!")
    }
})


//creating new instance of user model 
// signup api - /signup
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
