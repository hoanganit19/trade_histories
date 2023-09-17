const express = require("express");
const app = express();
const port = 3005;

const HomeController = require("./controllers/HomeController");
const ApiController = require("./controllers/ApiController");

app.get("/", HomeController.index);
app.get("/api/histories", ApiController.index);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
