const {
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const { equip, go, wait, shouldSupply, findBlocks } = require("../Utils/util");
const { enableAlert } = require("../Utils/Botalert");
const {
  farmlandStart,
  farmlandCoordsStart,
  farmlandCoordsEnd,
  tool,
  chestCoords,
} = require("./farmerConfig.js");

const farmer = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    // enableAlert(bot, ["Jagodziarek"], dcSend);
    async function getDirtBlocksBetweenCoordinates() {
      const dirt = await findBlocks(bot, "dirt", 50);
      const farmlands = await findBlocks(bot, "farmland", 50);
      const dirtBlocks = [...dirt, ...farmlands];
      console.log(dirtBlocks);
      const filteredArray = dirtBlocks.filter(
        (vec3) =>
          vec3.y >= farmlandCoordsStart.y &&
          vec3.y <= farmlandCoordsEnd.y &&
          vec3.x >= farmlandCoordsStart.x &&
          vec3.x <= farmlandCoordsEnd.x
      );
      filteredArray.sort((a, b) => {
        if (a.y !== b.y) {
          return a.y - b.y;
        }
        return a.x - b.x;
      });
      // console.log(filteredArray);
      return filteredArray;
    }

    const sowPlant = async (plant, coords) => {
      return new Promise(async (resolve, reject) => {
        console.log("finding block");
        const dirt = await bot.blockAt(coords);
        const planted = await bot.blockAt(
          new Vec3(coords.x, coords.y + 1, coords.z)
        );
        // console.log(planted);
        // console.log("asdfasd");
        // console.log(dirt);
        if (planted.name !== "air") {
          console.log("already planted");
          resolve();
          return;
        } else if (dirt && dirt.name === "farmland") {
          console.log("Farmland already present.");
        } else {
          console.log("Need to till the soil.");
          await makeFarmland(coords, tool);
        }
        await shouldSupply(bot, plant, 2, chestCoords, 256);
        await equip(bot, plant, dcSend);
        await bot.placeBlock(dirt, new Vec3(0, 1, 0)).catch((err) => {
          console.log("error");
          resolve();
        });
        resolve();
      });
    };
    const makeFarmland = async (coords, tool) => {
      return new Promise(async (resolve, reject) => {
        console.log("making farmland", coords);
        await shouldSupply(bot, tool, 1, chestCoords, 1);
        await equip(bot, tool, dcSend);
        await bot
          .activateBlock(bot.blockAt(coords), new Vec3(0, 1, 0))
          .then((x) => resolve());
      });
    };
    const toSow = await getDirtBlocksBetweenCoordinates();
    for (const block of toSow) {
      console.log("go", block);
      await go(bot, { x: block.x, y: block.y, z: block.z }, 3);
      console.log("sow");
      await sowPlant("potato", block);
    }
  });
};

module.exports = { farmer };
