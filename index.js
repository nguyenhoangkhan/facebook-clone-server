require("dotenv").config();

const fileUpload = require("express-fileupload");
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/index.js");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(fileUpload({ useTempFiles: true }));

app.use(cors());
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect to Database Successfully"))
  .catch((err) => console.log(`Conntect to Database Failed: ${err}`));

router(app);

app.listen(PORT, () => console.log("Server listening on port " + PORT));
