const { URLSearchParams } = require("url");
const { getHistories, sendMessage } = require("../ultis");
const dataPath = require("path").resolve(__dirname, "..") + "/data.txt";
const fs = require("fs");
var cron = require("node-cron");

cron.schedule("* * * * * *", async () => {
  const histories = await getHistories();
  const currentHistory = histories[0];
  const today = new Date();
  const endDayStr = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()} 23:59:59`;
  currentHistory.createdAt = today.getTime();
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

  data = data.map((item) => {
    return item.createdAt >= new Date(endDayStr).getTime();
  });

  fs.writeFileSync(dataPath, JSON.stringify(data));
});

module.exports = {
  index: async (req, res) => {
    res.send("Hello");
  },
};
