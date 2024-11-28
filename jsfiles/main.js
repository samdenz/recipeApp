

//using http module
let http = require('http');
let port = 82;

function requestCallBack(request, response){
    console.log("my first js code");
}

let server = http.createServer(requestCallBack);
server.listen(port)
console.log("listening...")

//using express js
//importing express module
const express = require("express")
const app = express()

//handling GET / request
app.use("/",(req,res)=>{
    res.send("this is the hello response");
})

//server setup
app.listen(82,() => {
    console.log("server is Running")
})