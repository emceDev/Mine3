const {
  Movements,
  goals: { GoalNear },
} = require("mineflayer-pathfinder");
const { Vec3 } = require("vec3");
const { wait, equip, findBlocks } = require("../Utils/util");
const { tosser } = require("../Utils/Tossing");
const { safeMovements } = require("../Utils/config");
const { beeCoords } = require("./honeyConfig");

const honeyMan = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    let fed = 0;
    let feedBees = [];
    let beesArray = [];

    const findBees = async () => {
      const bees = [];
      const entities = bot.entities;
      if (entities.length <= 1) {
        return [0];
      } else {
        for (const entityId in entities) {
          if (entities.hasOwnProperty(entityId)) {
            const entity = entities[entityId];
            const distance = entity.position.distanceTo(bot.entity.position);
            if (
              distance < 6 &&
              entity.name === "bee" &&
              !beesArray.includes(entity)
            ) {
              beesArray.push(entity);
              bees.push(entity);
            }
          }
        }
      }
      return bees;
    };
    const findHives = async () => {
      const honeyCombs = await findBlocks(bot, "beehive", 10);

      const hives = [];
      for (const hive of honeyCombs) {
        const block = await bot.blockAt(hive);
        hives.push(block);
      }
      return hives;
    };

    const logHoney = async (hives) => {
      const honeyCombs = hives;
      const honeyLevelCounts = {};
      for (const hive of honeyCombs) {
        const honeyLevel = hive._properties.honey_level;
        if (honeyLevelCounts[honeyLevel] === undefined) {
          honeyLevelCounts[honeyLevel] = 1;
        } else {
          honeyLevelCounts[honeyLevel]++;
        }
      }
      for (const honeyLevel in honeyLevelCounts) {
        dcSend(`honeylvl${honeyLevel}: ${honeyLevelCounts[honeyLevel]}`);
      }
    };

    const breedBees = async () => {
      const bees = await findBees();
      console.log("found this many bees to feed", bees.length);
      for (const bee of bees) {
        // if (!feedBees.includes(bee)) {
        await equip(bot, "poppy", dcSend);
        console.log("fed");
        await wait(100);
        await bot.useOn(bee);
        fed++;
        feedBees.push(bee);
        await equip(bot, "potato", dcSend);
      }
      await equip(bot, "potato", dcSend);
      return;
    };
    for (let i = 0; i < 100000; i++) {
      let fullHives = 0;
      const hives = await findHives();
      await breedBees();
      //get info on hives
      for (const hive of hives) {
        const honeyLevel = hive._properties.honey_level;
        honeyLevel === 5 && fullHives++;
      }
      console.log(
        `During this ${
          bot.time.isDay ? "day" : "night"
        } session fed: ${fed} many bees`
      );
      console.log(
        `Currently have this many hives: ${hives.length} and full: ${fullHives} `
      );
      fed = 0;
      await wait(5000);
    }
  });
};
module.exports = { honeyMan };

// // await logHoney(hives);
// // await findBees();
// setInterval(async () => {
//   let fullHives = 0;
//   feedBees = [];
//   fed = 0;
//   for (const hive of hives) {
//     // console.log(hive);
//     const honeyLevel = hive._properties.honey_level;
//     honeyLevel === 5 && fullHives++;
//   }
//   dcSend(
//     `"Is it day:" ${bot.time.isDay}"have", ${hives.length}/FullHIves:${fullHives}`
//   );
// }, 600000);
// setInterval(() => {
//   console.log(`fed in last 5 min:${fed}`);
//   fed = 0;
// }, 60000);
// // resolve();
