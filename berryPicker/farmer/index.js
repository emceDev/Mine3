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

const farmer = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    // enableAlert(bot, ["Jagodziarek"], dcSend);
    console.log("position");
    console.log(bot.entity.position);
    async function getBlocksBetweenCoordinates(
      bot,
      blockName,
      range,
      farmlandCoordsStart,
      farmlandCoordsEnd
    ) {
      const blocks = await findBlocks(bot, blockName, range);
      const filteredArray = blocks.filter(
        (vec3) =>
          vec3.y >= farmlandCoordsStart.y &&
          vec3.y <= farmlandCoordsEnd.y &&
          vec3.z >= farmlandCoordsStart.z &&
          vec3.z <= farmlandCoordsEnd.z &&
          vec3.x >= farmlandCoordsStart.x &&
          vec3.x <= farmlandCoordsEnd.x
      );

      return filteredArray;
    }
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
    const farmland = await getBlocksBetweenCoordinates(
      bot,
      "farmland",
      50,
      farmlandCoordsStart,
      farmlandCoordsEnd
    );
    const dirt = await getBlocksBetweenCoordinates(
      bot,
      "dirt",
      50,
      farmlandCoordsStart,
      farmlandCoordsEnd
    );

    const blocksUnsort = [...farmland, ...dirt];
    const plantArea = sorter(blocksUnsort);
    let plants = plantArea.length;
    let grownPlants = 0;
    let notPlanted = 0;
    let growing = 0;
    let plantedNow = 0;
    let harvestedNow = 0;
    console.log("plant space: ", plants);
    console.log("not planted: ", notPlanted);
    console.log("grown: ", grownPlants);
    console.log("growing: ", growing);
    const farm = async () => {
      const pos = bot.entity.position;
      console.log("warming up");
      await go(bot, new Vec3(pos.x, pos.y, pos.z - 3), 2, safeMovements);
      console.log("warming up end");
      await wait(5000);
      const checkX = (a, b, toggle) => {
        const curr = bot.blockAt(a).position.x;
        const next = bot.blockAt(b).position.x;
        if (curr !== next) {
          return true;
        } else if (toggle % 4 === 0) {
          return true;
        } else {
          return false;
        }
      };
      return new Promise(async (resolve, reject) => {
        let toggle = 0;
        let i = 0;
        bot.on("path_update", (stat) => {
          console.log("path update: ", stat.status);
        });
        bot.on("goal_updated", () => {
          console.log("goal updated");
        });
        bot.on("path_reset", (res) => {
          console.log("path reset: ", res);
        });
        for (const block of plantArea) {
          const plant = bot.blockAt(new Vec3(block.x, block.y + 1, block.z));

          const ifGo =
            plantArea[i - 1] && checkX(plantArea[i - 1], plantArea[i], toggle);
          if (ifGo === true) {
            // console.log("GOING true", i, block.z);
            await go(bot, block, 1, safeMovements);
            await wait(5000);
          }
          // if (plant.name === "air") {
          //   notPlanted++;
          //   await sowPlant("potato", block);
          //   plantedNow++;
          // } else {
          //   if (plant.metadata === 7) {
          //     console.log("groooown");
          //     grownPlants++;
          //     await bot.dig(
          //       bot.blockAt(
          //         new Vec3(block.x, block.y + 1, block.z),
          //         new Vec3(0, 0.5, 0)
          //       )
          //     );
          //     await sowPlant("potato", block);
          //     plantedNow++;
          //     harvestedNow++;
          //   } else {
          //     growing++;
          //   }
          // }
          toggle = toggle + 1;
          i = i + 1;
          await wait(Math.random() * (0.5 - 0.1) + 0.1);
        }
      });
    };
    await farm();
  });
};

module.exports = { farmer };
