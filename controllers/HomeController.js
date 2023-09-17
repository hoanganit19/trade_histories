const { URLSearchParams } = require("url");
const { getHistories, sendMessage } = require("../ultis");
const dataPath = require("path").resolve(__dirname, "..") + "/data.txt";
const fs = require("fs");
var cron = require("node-cron");

cron.schedule("* * * * * *", async () => {
  const histories = await getHistories();
  const currentHistory = histories[0];
  let data = fs.readFileSync(dataPath).toString();
  if (!data) {
    data = [];
  } else {
    data = JSON.parse(data);
  }

  const index = data.findIndex(
    (item) => item.IssueNumber === currentHistory.IssueNumber,
  );
  if (index === -1) {
    data.unshift(currentHistory);
  }

  fs.writeFileSync(dataPath, JSON.stringify(data));
});

module.exports = {
  index: async (req, res) => {
    res.send("Hello");
  },
};
