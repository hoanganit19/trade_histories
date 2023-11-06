const tradePath = require("path").resolve(__dirname, ".") + "/trade.txt";
const resultPath = require("path").resolve(__dirname, ".") + "/result.txt";
const lossPath = require("path").resolve(__dirname, ".") + "/loss.txt";
const statusPath = require("path").resolve(__dirname, ".") + "/status.txt";
const fs = require("fs");
const cron = require("node-cron");

const { getHistories, getGameIssue, sendOrder, getOrder } = require("./ultis");

const express = require("express");
var cors = require("cors");
const app = express();
const port = 3006;
app.use(cors());
process.env.TZ = "Asia/Ho_Chi_Minh";

const HomeController = require("./controllers/HomeController");
const ApiController = require("./controllers/ApiController");

// app.get("/", HomeController.index);
// app.get("/api/histories", ApiController.index);
app.get("/", (req, res) => {
  res.send("Hello BOT");
});

cron.schedule("* * * * * *", async () => {
  const arr = [10, 20, 50];
  const { IssueNumber: issueNumber } = await getGameIssue("66club");
  let histories = await getHistories("66club");
  histories = histories.slice(0, 2);
  const premium1 = histories[0].Premium;
  const premium2 = histories[1].Premium;
  let type;
  if (premium1 < premium2) {
    type = "small";
  } else {
    type = "big";
  }

  let index = fs.readFileSync(tradePath).toString();
  let result = fs.readFileSync(resultPath).toString();
  let loss = +fs.readFileSync(lossPath).toString();
  let status = +fs.readFileSync(statusPath).toString();
  if (loss && +issueNumber.slice(-1) === 0) {
    fs.writeFileSync(lossPath, "0");
    loss = 0;
  }

  const lastestOrder = await getOrder("66club");

  if (lastestOrder.IssueNumber !== issueNumber) {
    //Show kết quả
    if (lastestOrder.IssueNumber !== result) {
      let msg;
      if (+lastestOrder.State == 1) {
        msg = `Kết quả: ${lastestOrder.IssueNumber} Thắng`;
        index = 0;
      } else {
        msg = `Kết quả: ${lastestOrder.IssueNumber} Thua`;
        index++;
        if (index >= arr.length) {
          index = 0;
          fs.writeFileSync(lossPath, "1");
          loss = 1;
        }
      }
      console.log(index);
      fs.writeFileSync(tradePath, index + "");

      fs.writeFileSync(resultPath, lastestOrder.IssueNumber);

      console.log(msg);
    }

    if (!loss && status) {
      const order = await sendOrder(type, arr[index], issueNumber, "66club");

      console.log(order);
    }
  }
});

const TelegramBot = require("node-telegram-bot-api");
// replace the value below with the Telegram token you receive from @BotFather
const token = "6645928575:AAEDrcGrNjriMlU99Q0zV5VImA5VzeM9Y9E";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "/reset") {
    fs.writeFileSync(lossPath, "0");
    fs.writeFileSync(tradePath, "0");
    bot.sendMessage(chatId, "Reset bot thành công");
    return;
  }
  if (msg.text === "/status") {
    if (status) {
      bot.sendMessage(chatId, "Bot đang chạy");
    } else {
      bot.sendMessage(chatId, "Bot đang tắt");
    }
    return;
  }

  if (msg.text === "/turn_on") {
    fs.writeFileSync(statusPath, "1");
    bot.sendMessage(chatId, "Đã bật bot");
    return;
  }

  if (msg.text === "/turn_off") {
    fs.writeFileSync(statusPath, "0");
    bot.sendMessage(chatId, "Đã tắt bot");
    return;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
