const tradePath = require("path").resolve(__dirname, ".") + "/trade.txt";
const resultPath = require("path").resolve(__dirname, ".") + "/result.txt";
const lossPath = require("path").resolve(__dirname, ".") + "/loss.txt";
const statusPath = require("path").resolve(__dirname, ".") + "/status.txt";
const lastPath = require("path").resolve(__dirname, ".") + "/last.txt";
const lossNumberPath =
  require("path").resolve(__dirname, ".") + "/loss_number.txt";
const fs = require("fs");
const cron = require("node-cron");

const {
  getHistories,
  getGameIssue,
  sendOrder,
  getOrder,
  getAmount,
} = require("./ultis");

const express = require("express");
var cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
process.env.TZ = "Asia/Ho_Chi_Minh";

app.get("/", (req, res) => {
  res.send("Hello BOT");
});

// app.get("/test", async (req, res) => {
//   bot.sendMessage(656142850, "Xin chào");
//   res.json(await getAmount());
// });

cron.schedule("* * * * * *", async () => {
  const arr = [10, 10, 20, 30, 50, 80, 130];
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
  let last = +fs.readFileSync(lastPath).toString();
  let lossNumber = +fs.readFileSync(lossNumberPath).toString();

  // if (last && +issueNumber >= last + 10) {
  //   fs.writeFileSync(lastPath, "0");
  //   last = 0;
  // }
  // if (+issueNumber.slice(-1) >= 0 && +issueNumber.slice(-1) <= 4) {
  //   fs.writeFileSync(lastPath, "0");
  //   last = 0;
  // } else {
  //   fs.writeFileSync(lastPath, "1");
  //   last = 1;
  // }

  // if (loss) {
  //   type = "big";
  // }

  // if (
  //   +issueNumber.slice(-1) === 1 ||
  //   +issueNumber.slice(-1) === 2 ||
  //   +issueNumber.slice(-1) === 6 ||
  //   +issueNumber.slice(-1) === 7
  // ) {
  //   fs.writeFileSync(lastPath, "1");
  //   last = 1;
  // } else {
  //   fs.writeFileSync(lastPath, "0");
  //   last = 0;
  //   if (+issueNumber.slice(-1) > 0 && +issueNumber.slice(-1) < 5) {
  //     if (!loss) {
  //       type = "small";
  //     } else {
  //       type = "big";
  //     }
  //   } else {
  //     if (!loss) {
  //       type = "big";
  //     } else {
  //       type = "small";
  //     }
  //   }

  //   if (loss === 2) {
  //     if (premium1 < premium2) {
  //       type = "small";
  //     } else {
  //       type = "big";
  //     }
  //   }
  // }
  fs.writeFileSync(lastPath, "0");
  last = 0;
  if (+issueNumber.slice(-1) > 0 && +issueNumber.slice(-1) < 5) {
    if (!loss) {
      type = "small";
    } else {
      type = "big";
    }
  } else {
    if (!loss) {
      type = "big";
    } else {
      type = "small";
    }
  }

  if (loss === 2) {
    if (premium1 < premium2) {
      type = "small";
    } else {
      type = "big";
    }
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
          fs.writeFileSync(statusPath, "0");
          fs.writeFileSync(lossPath, "0");
          fs.writeFileSync(tradePath, "0");
          fs.writeFileSync(lastPath, "0");
          bot.sendMessage(656142850, "Tắt bot thành công");

          //Tăng số lượng thua tối đa
          //fs.writeFileSync(lossNumberPath, "1");
          // fs.writeFileSync(lastPath, lastestOrder.IssueNumber);
          // last = +lastestOrder.IssueNumber;
          if (lossNumber === 1) {
            // if (!loss) {
            //   fs.writeFileSync(lossPath, "0");
            //   loss = 1;
            // } else {
            //   fs.writeFileSync(lossPath, "0");
            //   loss = 0;
            // }
            // fs.writeFileSync(lossNumberPath, "0");
            // bot.sendMessage(
            //   656142850,
            //   "Đổi chiến lược: " + loss ? "Ngược" : "Thuận",
            // );
          }
        }
      }

      fs.writeFileSync(tradePath, index + "");

      fs.writeFileSync(resultPath, lastestOrder.IssueNumber);
      const amount = await getAmount();
      const output = `${msg} - Tổng tiền: ${(+amount).toLocaleString()}đ`;
      bot.sendMessage(656142850, output);
    }

    status = +fs.readFileSync(statusPath).toString();
    if (status && !last) {
      const order = await sendOrder(type, arr[index], issueNumber, "66club");
      bot.sendMessage(
        656142850,
        `Đánh ${type} - ${(arr[index] * 1000).toLocaleString()}đ`,
      );
      console.log(order);
    } else {
      // fs.writeFileSync(tradePath, "0");
    }
  }
});

const TelegramBot = require("node-telegram-bot-api");
// replace the value below with the Telegram token you receive from @BotFather
const token = "6645928575:AAH2ad6c6Qjldn0BQ_ylY2Sej_EdV4bxsDE";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(chatId);
  if (msg.text === "/reset") {
    fs.writeFileSync(lossPath, "0");
    fs.writeFileSync(tradePath, "0");
    fs.writeFileSync(lastPath, "0");
    fs.writeFileSync(lossNumberPath, "0");
    bot.sendMessage(chatId, "Reset bot thành công");
    return;
  }
  if (msg.text === "/status") {
    let status = +fs.readFileSync(statusPath).toString();
    if (status) {
      bot.sendMessage(chatId, "Bot đang chạy");
    } else {
      bot.sendMessage(chatId, "Bot đang tắt");
    }
    return;
  }

  if (msg.text === "/type") {
    let value;
    let loss = +fs.readFileSync(lossPath).toString();
    if (!loss) {
      value = "Chiến lược thuận";
    } else if (loss === 1) {
      value = "Chiến lược ngược";
    } else {
      value = "Chiến lược Premium";
    }
    bot.sendMessage(chatId, value);
    return;
  }

  if (msg.text === "/turn_on") {
    fs.writeFileSync(statusPath, "1");
    bot.sendMessage(chatId, "Đã bật bot");
    return;
  }

  if (msg.text === "/turn_off") {
    fs.writeFileSync(statusPath, "0");
    fs.writeFileSync(lossPath, "0");
    fs.writeFileSync(tradePath, "0");
    fs.writeFileSync(lastPath, "0");
    bot.sendMessage(chatId, "Đã tắt bot");
    return;
  }
  if (msg.text === "/type_0") {
    fs.writeFileSync(lossPath, "0");
    bot.sendMessage(chatId, "Đã đổi chiến lược thuận");
    return;
  }

  if (msg.text === "/type_1") {
    fs.writeFileSync(lossPath, "1");
    bot.sendMessage(chatId, "Đã đổi chiến lược ngược");
    return;
  }

  if (msg.text === "/type_2") {
    fs.writeFileSync(lossPath, "2");
    bot.sendMessage(chatId, "Đã đổi chiến lược Premium");
    return;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
