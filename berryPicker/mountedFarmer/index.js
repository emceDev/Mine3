const {
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const {
  equip,
  go,
  wait,
  shouldSupply,
  findBlocks,
  BerrySorter,
} = require("../Utils/util");
const { enableAlert } = require("../Utils/Botalert");
const {
  farmlandCoordsStart,
  farmlandCoordsEnd,
  tool,
  chestCoords,
} = require("./farmerConfig.js");
const { safeMovements } = require("../Utils/config");
const { sorter } = require("../berryPicker/util");

const mountedFarmer = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    // enableAlert(bot, ["Jagodziarek"], dcSend);
    console.log("position");
    console.log(bot.entity.position);

    const sowPlant = async (plant, coords) => {
      return new Promise(async (resolve, reject) => {
        console.log("finding block");
        const dirt = await bot.blockAt(coords);
        const planted = await bot.blockAt(
          new Vec3(coords.x, coords.y + 1, coords.z)
        );
        if (planted.metadata === 7) {
          await bot.dig(planted);
        }
        if (dirt && dirt.name === "farmland") {
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

    const farmland = findBlocks(bot, "farmland", 5);
    const dirt = findBlocks(bot, "dirt", 5);
    const cart = await findBlocks(bot, "minecart", 5)[0];
    bot.mount(bot.entityAt(cart));
    const blocksUnsort = [...farmland, ...dirt];
    // const plantArea = sorter(blocksUnsort);
    const farm = async () => {
      return new Promise(async (resolve, reject) => {
        let toggle = 0;
        let i = 0;
        for (const block of plantArea) {
          const plant = bot.blockAt(new Vec3(block.x, block.y + 1, block.z));
          if (plant.name === "air") {
            notPlanted++;
            await sowPlant("potato", block);
            plantedNow++;
          } else {
            if (plant.metadata === 7) {
              console.log("groooown");
              grownPlants++;
              await bot.dig(
                bot.blockAt(
                  new Vec3(block.x, block.y + 1, block.z),
                  new Vec3(0, 0.5, 0)
                )
              );
              await sowPlant("potato", block);
              plantedNow++;
              harvestedNow++;
            } else {
              growing++;
            }
          }
          toggle = toggle + 1;
          i = i + 1;
          await wait(Math.random() * (0.5 - 0.1) + 0.1);
        }
      });
    };
    await farm();
  });
};

module.exports = { mountedFarmer };
