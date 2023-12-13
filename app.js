const express = require('express')

const path = require('path');
const cors = require('cors')
const app = express();
const server = require("http").createServer(app); 

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));
app.use(cors)
io.on("connection", function(socket) {
    socket.on("newuser",function(username){
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser",function(username){
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("chat",function(message){
        socket.broadcast.emit("chat", message);
    });
});
const port = process.env.PORT || 5000
server.listen(port, (err) => {
  try{
    console.log(`Listening to port ${port}...`)
  }catch(err){
    console.log(`Something went wrong: ${err}`)
    process.exit(1)
  }
});