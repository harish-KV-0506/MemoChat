
const socket = io();
let phone="", aiMode=true;

function sendOTP(){
 phone=document.getElementById("phone").value;
 socket.emit("send_otp",phone);
 document.getElementById("login").classList.add("hidden");
 document.getElementById("otp").classList.remove("hidden");
}

function verifyOTP(){
 socket.emit("verify_otp",document.getElementById("otpInput").value);
}

socket.on("auth_success",d=>{
 localStorage.setItem("token",d.token);
 document.getElementById("otp").classList.add("hidden");
 document.getElementById("app").classList.remove("hidden");
 document.getElementById("me").innerText=d.user.phone;
});

function logout(){
 localStorage.clear();
 location.reload();
}

function openAI(){
 aiMode=true;
 document.getElementById("messages").innerHTML="";
}

function send(){
 const msg=document.getElementById("msg").value;
 if(!msg)return;
 socket.emit(aiMode?"ai_message":"chat_message",msg);
 add(msg,true);
 document.getElementById("msg").value="";
}

socket.on("chat_message",m=>add(m,false));
socket.on("ai_reply",m=>add(m,false));

function add(t,me){
 const d=document.createElement("div");
 d.className="msg"+(me?" me":"");
 d.innerText=t;
 document.getElementById("messages").appendChild(d);
}
