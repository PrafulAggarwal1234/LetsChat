import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    //console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
     
    });
    socket.on("typing", (room) => socket.in(room).emit("typing",room));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing",room));
  
    socket.on("new message", (newMessageRecieved) => {
      //console.log('newmsg: ',newMessageRecieved)
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return //console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
        
        socket.in(user._id).emit("message received", newMessageRecieved);
      });
    });
  
    socket.off("setup", () => {
      //console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      //console.log(`> Ready on http://${hostname}:${port}`);
    });
});