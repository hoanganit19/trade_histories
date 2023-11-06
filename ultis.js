const { URLSearchParams } = require("url");

module.exports = {
  getGameIssue: async (vendor = "66club") => {
    const data = {
      typeid: "1",
      language: "vi",
    };
    const repsonse = await fetch(
      `https://${
        vendor === "66club" ? "66clubapiapi" : "82vn82vnapi"
      }.com/api/webapi/GetGameIssue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      },
    );

    const result = await repsonse.json();
    return result.data;
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

  getHistories: async (vendor = "66club") => {
    const data = {
      typeid: "1",
      language: "vi",
      pageno: 1,
    };
    const repsonse = await fetch(
      `https://${
        vendor === "66club" ? "66clubapiapi" : "82vn82vnapi"
      }.com/api/webapi/GetNoaverageEmerdList`,
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

  sendOrder: async (type, amount, id, vendor = "66club") => {
    const data = {
      typeid: "1",
      language: "vi",
      uid: "355508",
      sign: "1FA466C0C04043554A4DB9D4B743F571B160043A897670AF087EEA4B405A7538",
      amount: 1000,
      betcount: amount,
      gametype: 2,
      selecttype: type,
      issuenumber: id,
    };
    const repsonse = await fetch(
      `https://${
        vendor === "66club" ? "66clubapiapi" : "82vn82vnapi"
      }.com/api/webapi/GameBetting`,
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

  getType: (number) => {
    return number < 5 ? "small" : "big";
  },

  getOrder: async (vendor = "66club") => {
    const data = {
      typeid: "1",
      language: "vi",
      uid: "355508",
      sign: "1FA466C0C04043554A4DB9D4B743F571B160043A897670AF087EEA4B405A7538",
      pageno: 1,
    };
    const repsonse = await fetch(
      `https://${
        vendor === "66club" ? "66clubapiapi" : "82vn82vnapi"
      }.com/api/webapi/GetMyEmerdList`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      },
    );

    const result = await repsonse.json();
    return result.data.myorderlist[0];
  },
};
