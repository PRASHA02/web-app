const express = require('express')

const path = require('path');
const app = express();
const server = require("http").createServer(app); 

const cors = require("cors");

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));

app.use(cors());


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

//using cluster

// const express = require('express');
// const cluster = require("cluster");
// const totalCPUs = require("os").cpus().length;

// if (cluster.isMaster) {
//     console.log(`Number of CPUs is ${totalCPUs}`);
//     console.log(`Master ${process.pid} is running`);

//     // Fork workers.
//     for (let i = 0; i < totalCPUs; i++) {
//         cluster.fork();
//     }

//     cluster.on("exit", (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} died`);
//         console.log("Let's fork another worker!");
//         cluster.fork();
//     });
// } else {
//     start();
// }

// function start() {
//     const path = require('path');
//     const app = express();
//     const server = require("http").createServer(app);
//     const cors = require("cors");
//     const io = require("socket.io")(server);

//     app.use(express.static(path.join(__dirname, "/public")));
//     app.use(cors());

//     io.on("connection", function(socket) {
//         socket.on("newuser", function(username) {
//             socket.broadcast.emit("update", username + " joined the conversation");
//         });
//         socket.on("exituser", function(username) {
//             socket.broadcast.emit("update", username + " left the conversation");
//         });
//         socket.on("chat", function(message) {
//             socket.broadcast.emit("chat", message);
//         });
//     });

//     const port = process.env.PORT || 5000;
//     server.listen(port, (err) => {
//         if (err) {
//             if (err.code === 'EADDRINUSE') {
//                 console.log(`Port ${port} is already in use, trying another port...`);
//                 server.listen(0);  // 0 means any random available port
//             } else {
//                 console.log(`Something went wrong: ${err}`);
//                 process.exit(1);
//             }
//         } else {
//             console.log(`Listening to port ${port}...`);
//         }
//     });

//     server.on('listening', () => {
//         console.log(`Server is listening on port ${server.address().port}`);
//     });
// }
