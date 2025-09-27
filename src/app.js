const express = require('express');

// this app is an instance of express js application
//it can also be referred as Web Server
const app = express();

app.use("/test",(req,res)=>{
    res.send("Test from the server!!");
})

app.use("/hello",(req,res)=>{
    res.send("Hello from the server!!");
})

app.use("/",(req,res)=>{
    res.send("I am Home Page!!");
})

port = 7777;
app.listen(port,()=>{
    console.log(`Server is Running at port http://127.0.0.1:${port}`);
});

