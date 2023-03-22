const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
require("dotenv").config();

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
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(morgan("tiny"));
app.use(express.json({ limit: "6000mb" })); //Used to parse JSON bodies
app.use(express.urlencoded({ limit: "6000mb", extended: true })); //Parse URL-encoded bodies

//Routes Middleware
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

app.listen(port, () => {
  console.log(`Wuda Lounge server is running at http://localhost:${port}`);
});
