const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
require("dotenv").config();

// Import the Socket.IO library
const socketIo = require("socket.io");

//App
const app = express();
const port = process.env.PORT || 8000;

//Connect to db
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE, {
    keepAlive: true,
  })
  .then(() => {
    console.log("Db Connection Succesful");
  })
  .catch((error) =>
    console.log(`Connection Error! ${error.message}, Error Code: ${error.code}`)
  );

//Middlewares
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json({ limit: "6000mb" })); //Used to parse JSON bodies
app.use(express.urlencoded({ limit: "6000mb", extended: true })); //Parse URL-encoded bodies

//Routes Middleware
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

const server = app.listen(port, () => {
  console.log(`Wuda Lounge server is running at http://localhost:${port}`);
});

//Socket.IO setup
const io = require("socket.io")(server, {
  cors: {
    origin: "https://wudalounge.com", //Allow requests from this origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  //Listen for new order events from the client
  socket.on("newOrder", (data) => {
    console.log(`New order received: ${JSON.stringify(data)}`);
    //Broadcast the new order to all connected clients
    io.emit("newOrder", data);
  });

  //Disconnect event
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

module.exports = { server, io };
