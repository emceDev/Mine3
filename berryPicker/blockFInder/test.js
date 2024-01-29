const { blockFinder } = require(".");

const { startBot } = require("../lumberBerry/botInitialize");

const test = async () => {
  const dcSend = (message) => {
    console.log(message);
  };
  const bot = await startBot(dcSend);
  // for (let i = 0; i < 2; i++) {
  // bot.chat("tp 40 50");
  await blockFinder(bot, dcSend);
  // await wait(4000);
  //   // bot.chat("tp 40 50");
  // }
};

test();
