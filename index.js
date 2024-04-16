const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 6060;

app.get("/", (req, res) => {
  res.send("Instock API Team 3 Test");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
