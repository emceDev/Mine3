const { grinderAfk } = require(".");
const { enableAlert } = require("../Utils/Botalert");
const { wait } = require("../Utils/util");
const { startBot } = require("../lumberBerry/botInitialize");
const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };

  bot = await startBot(dcSend);
  await wait(1000);
  enableAlert(bot, ["Jagodziarek"], dcSend);
  console.log("doing things on alert");
  await grinderAfk(bot, dcSend);
};

test();
