require("dotenv").config();
require("./database/connection");

const express = require("express");
const app = express();

const path = require("path");
const uploadFolder = path.resolve(__dirname, "..", "uploads");
console.log(uploadFolder);

const cors = require("cors");

const port = process.env["PORT"];
const routes = require("./routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(routes);

app.use("/uploads", express.static(uploadFolder));

app.listen(port, () => {
  console.log("API escutando na porta " + port);
});
