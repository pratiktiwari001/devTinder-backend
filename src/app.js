const express = require('express');
const {adminAuth,userAuth} = require('./middlewares/auth.js');


// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();


const user = {
    "name" : "pratik",
    "age" : 20,
    "city" : "delhi"
}

//Middleware for authorization
app.use("/delete",adminAuth);

app.get("/delete/getdata",(req,res)=>{
    res.send("data fetched");
    console.log("Get Data")
});

app.get("/delete/userdata",(req,res)=>{
    try {
        throw new Error('undefined')
        res.send("data deleted");
        console.log("Delete Data");
        
    } catch (error) {
        res.status(502).send("error occured");
        console.log("Some error!");
    }
});

app.post("/user/login",(req,res)=>{
    res.send("Logged In Successfully!");
    console.log("/user/login works fine")
});

app.get("/user",userAuth,(req,res)=>{
    res.send("Access granted");
});

app.post("/user",(req,res)=>{
    res.send("Data Saved successfully");
});

app.delete("/user",(req,res)=>{
    res.send("Data Deleted successfully");
});


app.use("/",(err,req,res,next)=>{
    res.status(501).send("there is error!");
    console.log("Some error!");
});

// app.use("/user",(req,res)=>{
//     res.send("I am default!!")
// });


port = 7777;
app.listen(port,()=>{
    console.log(`Server is Running at port http://127.0.0.1:${port}`);
});

