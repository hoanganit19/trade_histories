const { URLSearchParams } = require("url");

module.exports = {
  getGameIssue: async () => {
    const data = {
      typeid: "1",
      language: "vi",
    };
    const repsonse = await fetch(
      `https://66clubapiapi.com/api/webapi/GetGameIssue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      },
    );

    const result = await repsonse.json();
    return result;
  },

  sendMessage: async (message) => {
    const TelegramBot = require("node-telegram-bot-api");

    // replace the value below with the Telegram token you receive from @BotFather
    const token = "1632033406:AAGSO9m6h1caEODbjf-TWuuE0nRDrfvSAcY";

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token);

    const status = await bot.sendMessage("656142850", message);

    return status;
  },

  getHistories: async () => {
    const data = {
      typeid: "1",
      language: "vi",
      pageno: 1,
    };
    const repsonse = await fetch(
      `https://66clubapiapi.com/api/webapi/GetNoaverageEmerdList`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      },
    );

    const histories = await repsonse.json();

    return histories.data.gameslist;
  },
};
