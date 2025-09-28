const express = require('express');

// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();

const user = {
    "name" : "pratik",
    "age" : 20,
    "city" : "delhi"
}

app.get("/user",[(req,res,next)=>{
    console.log("Getting the user 1st time");
    next();
    // res.send("Response 1");
},(req,res,next)=>{
    console.log("Getting the user 2nd time");
    next();
    // res.send("Response 2");
},(req,res,next)=>{
    console.log("Getting the user 3rd time");
    // res.send("Response 3");
    next();
},(req,res,next)=>{
    console.log("Getting the user 4th time");
    // res.send("Response 4");
    next();
},(req,res)=>{
    console.log("Getting the user 5th time");
    res.send("Response 5");
}]);

app.post("/user",(req,res)=>{
    res.send("Data Saved successfully");
});

app.delete("/user",(req,res)=>{
    res.send("Data Deleted successfully");
});

app.use("/user",(req,res)=>{
    res.send("I am default!!")
});


port = 7777;
app.listen(port,()=>{
    console.log(`Server is Running at port http://127.0.0.1:${port}`);
});

