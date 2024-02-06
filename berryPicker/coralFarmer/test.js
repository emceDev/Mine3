const { coralFarmer } = require(".");
const { enableAlert } = require("../Utils/Botalert");
const { wait } = require("../Utils/util");
const { startBot } = require("../lumberBerry/botInitialize");

const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };

  bot = await startBot(dcSend);

  await coralFarmer(bot, dcSend);
};

test();
