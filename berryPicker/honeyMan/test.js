const { honeyMan } = require(".");
const { wait } = require("../Utils/util");
const { startBot } = require("../lumberBerry/botInitialize");

const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };
  const bot = await startBot(dcSend);
  for (let i = 0; i < 2; i++) {
    await honeyMan(bot, dcSend);
  }
};

test();
