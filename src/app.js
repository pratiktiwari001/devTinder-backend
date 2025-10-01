const express = require('express');
const connectDB = require("./config/database");
const User = require('./models/user')


// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();

//middleware for converting json data into js object
app.use("/", express.json());

//creating new instance of user model 
// post api - /signup
app.post("/signup", async (req, res) => {
    
    try {
        const data = req.body;
        if (data?.skills?.length > 10){
            throw new Error("You can add maximum 10 skills")
        }
        const user = new User(data);
        await user.save();
        res.send("data saved")
    } catch (error) {
        res.status(400).send("Error sending the user: " + error.message)
    }
});

//getting users with filtered mail ID
app.get("/user", async (req, res) => {
    const userMail = req.body.emailID;
    try {
        const users = await User.find({ emailID: userMail });
        if (users.length === 0) {
            res.status(404).send("No user found!!")
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Something went wrong")
    }
})

// get - /feed
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("No user found!!")
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Some error occured!")
    }
})

// get -findById
app.get("/feed/id", async (req, res) => {
    try {
        const user = await User.findById('68db8720ec3c56e61548a428');
        if (!user) {
            res.status(404).send("No user found!!")
        } else {
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("Some error occured!")
    }
})


// delete user by their ID
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("Deleted Successfully!!")
    } catch (error) {
        res.status(400).send("Some error occured!")
    }
})


//delete by other fields
app.delete("/user/name", async (req, res) => {
    const name = req.body.firstName;
    try {
        const user = await User.deleteOne({ firstName: name });
        console.log(user)
        res.send("user deleted successfully");
    } catch (error) {
        res.status(400).send("Some error occured!")
    }
})

// patch api -update
app.patch("/user/:userID", async (req, res) => {
    try {
        const userID = req.params?.userID;
        const data = req.body;
        const allowedUpdate = ["password", "age", "gender", "photoUrl", "skills"];
        const updates = Object.keys(data);
        const isAllowed = updates.every((key) => allowedUpdate.includes(key));
        if (!isAllowed) {
            throw new Error("Update not allowed");
        }
        if (data?.skills?.length > 10){
            throw new Error("You can add maximum 10 skills")
        }
        const user = await User.findByIdAndUpdate({ _id: userID }, data, { returnDocument: 'after', runValidators: true });
        if (!user) {
            res.status(404).send("not found")
        } else {
            res.send("User Updated Successfully")
        }
    } catch (error) {
        res.status(400).send("UPDATE FAILED: " + error.message);
    }
})


connectDB().then(() => {
    console.log("connected succesfully!!")
    port = 7777;
    app.listen(port, () => {
        console.log(`Server is Running at port http://127.0.0.1:${port}`);
    });
}).catch((err) => {
    console.log("Error in connecting the database!")
});
