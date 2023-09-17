const dataPath = require("path").resolve(__dirname, "..") + "/data.txt";
const fs = require("fs");
module.exports = {
  index: (req, res) => {
    let data = fs.readFileSync(dataPath).toString();
    res.send(data);
  },
};
