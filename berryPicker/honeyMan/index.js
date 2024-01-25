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
    bot.on("entitySpawn", async (bee) => {
      if (bee.name === "bee") {
        console.log(bee);
        if (!beesArray.includes(bee)) {
          beesArray.push(bee);
        }
        if (!feedBees.includes(bee)) {
          await equip(bot, "poppy", dcSend);
          feedBees.push(bee);
          await bot.useOn(bee);
          fed = fed + 1;
          await equip(bot, "potato", dcSend);
        }
      }
    });

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
            if (distance < 6 && entity.name === "bee") {
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
    const breedBees = async (bees) => {
      await equip(bot, "poppy", dcSend);
      for (const bee of bees) {
        await bot.useOn(bee);
        fed = fed++;
        await wait(500);
      }
    };
    // const collectHoney = async (hive) => {
    //   await equip(bot, "shears", dcSend);
    //   console.log("collecting:", hive);
    //   await bot.useOn(hive);
    // };
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
    const hives = await findHives();

    await logHoney(hives);
    dcSend(
      `"Is it day:" ${bot.time.isDay}"have hives/bees: ", ${hives.length}, "/", ${beesArray.length}, fed:${feedBees.length}`
    );
    setInterval(async () => {
      dcSend(`fed bees: ${fed} `);
      dcSend(`fed hives: ${hives.length} `);
      feedBees = [];
      // for (const hive of hives) {
      //   // console.log(hive);
      //   const honeyLevel = hive._properties.honey_level;
      //   // honeyLevel === 5 && (await collectHoney(hive));
      // }
    }, 300000);
    // resolve();
  });
};
module.exports = { honeyMan };
