const {
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const { wait, equip, findBlocks, go } = require("../Utils/util");
const { safeMovements } = require("../Utils/config");
const { searchCoords } = require("./blockFinderConfig");

const blockFinder = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    const blockArray = async (blockName, distance) => {
      let blocksFound = [];
      const blocks = await findBlocks(bot, blockName, distance);
      for (const block of blocks) {
        blocksFound.push(bot.blockAt(block));
      }
      return blocksFound;
    };
    bot.on("whisper", async (u, m) => {
      console.log("Searching:");
      const arra = await blockArray("ancient_debris", 100);
      console.log("Found:", arra.length);
      for (const block of arra) {
        dcSend(block.position);
      }
    });

    await go(bot, searchCoords, 1, safeMovements);
    bot.once("spawn", () => {
      console.log("spawned");
    });

    await wait(10000);

    resolve();
  });
};
module.exports = { blockFinder };
