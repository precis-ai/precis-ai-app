const express = require("express");
require("dotenv").config();

const port = process.env.REACT_APP_PORT || 80;
const app = express();
const path = require("path");

const publicDir = path.join(__dirname, "build");

app.use(express.static(publicDir));

app.all("*", (req, res) => {
  res.sendFile(`${publicDir}/index.html`);
});

app.listen(port, () =>
  console.log(`app listening on http://localhost:${port}`)
);
module.exports = app;
