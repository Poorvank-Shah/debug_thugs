const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
	allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true
  }
});


io.on("connection", (socket) => {
  console.log("New client connected", socket.id); // Log when a new client connects
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id); // Log when a client disconnects
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(process.env.PORT || 5000, () => console.log("server is running on port 5000", process.env.PORT));