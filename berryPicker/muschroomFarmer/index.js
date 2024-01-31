const {
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const {
  wait,
  equip,
  go,
  findBlocks,
  checkPrice,
  applyBoneMeal,
  sowPlant,
  shouldSupply,
} = require("../Utils/util");
const { tosser } = require("../Utils/Tossing");
const { safeMovements } = require("../Utils/config");
const {
  coords,
  tossingPoint,
  closeCoords,
  chestCoords,
} = require("./mushConfig");
const { enableAlert } = require("../Utils/Botalert");

const MuschroomFarmer = async (bot, dcSend) => {
  let blocksCut = 0;
  let boneMealUsed = 0;
  let profit = 0;
  console.log("farmer started");
  return new Promise(async (resolve, reject) => {
    //   console.log(bot.inventory.items());
    const getMushrooms = async () => {
      console.log("Searching for mushrooms");
      return new Promise(async (resolve, reject) => {
        await wait(500);
        const stem = await findBlocks(bot, "mushroom_stem", 20);
        await wait(500);
        const cap = await findBlocks(bot, "red_mushroom_block", 20);
        await wait(500);
        const center = coords;

        // Corrected shuffleArray function
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
        }

        // Sorting function with added randomness
        function compareForSpiralSorting(a, b) {
          const angleA = Math.atan2(a.z - center.z, a.x - center.x);
          const angleB = Math.atan2(b.z - center.z, b.x - center.x);

          // Introduce randomness
          const randomFactor = Math.random() * 2 - 1; // Random number between -1 and 1
          const randomizedDifference = angleA - angleB + randomFactor;

          return randomizedDifference;
        }
        shuffleArray(cap);
        // Combine stem and cap arrays and shuffle them in place
        const coordinates = [...cap];

        // Sort the shuffled array using the sorting function
        coordinates.sort(compareForSpiralSorting);

        // Now 'coordinates' is randomly shuffled and sorted
        // console.log(coordinates);
        const fullCoords = [...stem, ...coordinates];
        resolve(fullCoords);
      });
    };
    const harvestMushroom = async (shroms) => {
      console.log("harvesting");
      console.log("found:" + shroms.length + "for:" + shroms.length * 9);

      return new Promise(async (resolve, reject) => {
        await shouldSupply(bot, "diamond_axe", 1, chestCoords, 1);
        await equip(bot, "diamond_axe", dcSend);
        let unseen = [];
        for (const shrom of shroms) {
          const block = bot.blockAt(shrom);

          await bot
            .dig(block, true, "raycast")
            .then((x) => (blocksCut = blocksCut + 1))
            .catch((err) => unseen.push(block));

          await wait(Math.floor(Math.random() * 100) + 50);
        }
        for (const shrom of unseen) {
          console.log("unsese");
          blocksCut = blocksCut + 1;
          const block = bot.blockAt(shrom);
          await bot
            .dig(block, true, "raycast")
            .catch((err) => console.log("cannod dig"));

          await wait(Math.floor(Math.random() * 100) + 50);
        }
        resolve();
      });
    };
    const plantMushroom = async () => {
      return new Promise(async (resolve, reject) => {
        console.log("planting mushrooms");
        await go(bot, closeCoords, 1, safeMovements);
        await shouldSupply(bot, "red_mushroom", 1, chestCoords, 64);
        await sowPlant(bot, coords, "red_mushroom", dcSend).catch(
          async (err) => await sowPlant(bot, coords, "red_mushroom", dcSend)
        );
        await shouldSupply(bot, "bone_meal", 20, chestCoords, 256);
        await applyBoneMeal(bot, coords, dcSend, 100).then(
          (used) => (boneMealUsed = boneMealUsed + used)
        );

        resolve();
      });
    };
    const freeEQ = async () => {
      await tosser(bot, "red_mushroom_block", closeCoords);
      await tosser(bot, "mushroom_stem", closeCoords);

      // await tosser(bot, "red_mushroom_block", tossingPoint);
    };
    const saveTool = async (itemName) => {
      return bot.inventory.items().filter(async (item) => {
        if (item && item.name === itemName) {
          console.log("have such an item");
          if (item.nbt.value.Damage.value + 100 >= item.maxDurability) {
            console.log("found damaged item");
            await go(
              bot,
              {
                x: tossingPoint.x,
                y: tossingPoint.y,
                z: tossingPoint.z,
              },
              1
            );
            await bot.lookAt(
              new Vec3(tossingPoint.x, tossingPoint.y + 2, tossingPoint.z + 2),
              true
            );
            console.log("tossing to save");
            await bot.tossStack(item);
            return;
          }
        }
      });
    };

    (await bot.inventory.emptySlotCount()) < 5 && (await freeEQ());
    await saveTool("diamond_axe");
    await harvestMushroom(await getMushrooms()).catch((err) =>
      console.log("error")
    );
    console.log("harvested");
    await plantMushroom().catch((err) => console.log("error"));
    console.log("planted");
    profit = blocksCut * 9;
    // dcSend("profit:" + profit);
    resolve(profit);
  });
};
module.exports = { MuschroomFarmer };
