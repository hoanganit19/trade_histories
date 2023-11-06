const { URLSearchParams } = require("url");
const {
  getHistories,
  sendMessage,
  getGameIssue,
  getType,
} = require("../ultis");
const dataPath = require("path").resolve(__dirname, "..") + "/data.txt";
const tradePath = require("path").resolve(__dirname, "..") + "/trade.txt";
const fs = require("fs");
var cron = require("node-cron");

// cron.schedule("* * * * * *", async () => {
//   const histories = await getHistories();
//   const currentHistory = histories[0];
//   const today = new Date();
//   const endDayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} 23:59:59`;
//   currentHistory.createdAt = today.getTime();
//   let data = fs.readFileSync(dataPath).toString();
//   if (!data) {
//     data = [];
//   } else {
//     data = JSON.parse(data);
//   }

//   const index = data.findIndex(
//     (item) => item.IssueNumber === currentHistory.IssueNumber,
//   );
//   if (index === -1) {
//     data.unshift(currentHistory);
//   }

//   data = data.filter((item) => {
//     return item.createdAt > new Date(endDayStr).getTime();
//   });

//   fs.writeFileSync(dataPath, JSON.stringify(data));
// });

module.exports = {
  index: async (req, res) => {
    // const bet = [10000, 20000, 50000];

    // const { IssueNumber } = await getGameIssue();

    // const histories = await getHistories();
    // const { Number } = histories[0];

    // let trade = fs.readFileSync(tradePath).toString();
    // if (trade) {
    //   trade = JSON.parse(trade);
    // } else {
    //   trade = {};
    // }

    // let { tradeId, betIndex, type } = trade;

    // if (tradeId !== IssueNumber) {
    //   if (!betIndex) {
    //     betIndex = 0;
    //   } else {
    //   }

    //   console.log(bet[betIndex]);
    // }

    res.send("Hello");
  },
};
