
const express=require("express");
const http=require("http");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const socketio=require("socket.io");

const app=express();
const server=http.createServer(app);
const io=socketio(server);

app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1/memochat");

const User=mongoose.model("User",new mongoose.Schema({
 phone:String,
 createdAt:{type:Date,default:Date.now}
}));

io.on("connection",socket=>{
 let phone=null;

 socket.on("send_otp",p=>phone=p);

 socket.on("verify_otp",async otp=>{
  if(otp!=="123456")return;
  let user=await User.findOne({phone});
  if(!user) user=await User.create({phone});
  const token=jwt.sign({id:user._id},"SECRET");
  socket.emit("auth_success",{token,user});
 });

 socket.on("chat_message",msg=>socket.broadcast.emit("chat_message",msg));

 socket.on("ai_message",msg=>socket.emit("ai_reply","🤖 AI: "+msg));
});

server.listen(3000,()=>console.log("MemoChat running at http://localhost:3000"));
