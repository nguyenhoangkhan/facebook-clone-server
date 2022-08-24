const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/index.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connect to Database Successfully"))
  .catch((err) => console.log(`Conntect to Database Failed: ${err}`));

router(app);

app.listen(PORT, () => console.log("Server listening on port " + PORT));
