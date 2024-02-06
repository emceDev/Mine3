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
  applyBoneMeal,
  checkIfHaveInEq,
  equipItemFromEq,
  resuplyAtNearby,
  onlyToss,
} = require("../Utils/util");
const { enableAlert } = require("../Utils/Botalert");
const { safeMovements } = require("../Utils/config");
const { sorter } = require("../berryPicker/util");

const coralFarmer = async (bot, dcSend) => {
  return new Promise(async (resolve, reject) => {
    const resuply = async () => {
      bot.chat("/is home s");
      await wait(5000);
      (await checkIfHaveInEq(bot, "iron_shovel", 1))
        ? null
        : await resuplyAtNearby(bot, "iron_shovel", 1);
      console.log("resuplying shovel");

      console.log("resuplying bone meal");
      (await checkIfHaveInEq(bot, "bone_meal", 128))
        ? null
        : await resuplyAtNearby(bot, "bone_meal", 128);
      // console.log("tossing");
      const items = bot.inventory.items();
      for (const item of items) {
        // console.log("tossing: ", item.name);
        item.name.includes("coral") && (await onlyToss(bot, item.name));
      }
      console.log("resuply ended");
      bot.chat("/is home c");
      await wait(5000);
    };
    const currentPos = bot.entity.position;
    const radius = 5;
    let coralPicked = 0;
    let boneMealUsed = 0;
    let unseen = [];
    await resuply();
    const pick = async (block, repick) => {
      return new Promise(async (resolve, reject) => {
        // console.log(`Block at (${block.position}: ${block.name}`);
        if (block.name.includes("coral")) {
          // console.log("equiping for coral");
          await equipItemFromEq(bot, "iron_shovel", dcSend).catch(
            async (err) => await resuply()
          );

          await bot.dig(block).then((x) => coralPicked++);

          resolve();
        } else if (block.name.includes("grass")) {
          // console.log("equiping for grass");
          await equipItemFromEq(bot, "bone_meal", dcSend).catch(
            async (err) => await resuply()
          );
          await bot.dig(block);
          resolve();
        } else {
          resolve();
        }
      });
    };
    for (let i = 0; i < 1000; i++) {
      (await bot.inventory.emptySlotCount()) < 5 && (await resuply());
      for (let x = currentPos.x - radius; x <= currentPos.x + radius; x++) {
        for (let z = currentPos.z - radius; z <= currentPos.z + radius; z++) {
          const block = bot.blockAt(new Vec3(x, currentPos.y, z));
          await wait(100);
          await pick(block);
        }
      }
      const blockStadingOn = bot.blockAt(
        new Vec3(currentPos.x, currentPos.y, currentPos.z)
      );

      blockStadingOn.name !== "water" && (await bot.dig(blockStadingOn));
      await equipItemFromEq(bot, "bone_meal", dcSend).catch(
        async (err) => await resuply()
      );

      await bot.activateBlock(
        bot.blockAt(new Vec3(currentPos.x, currentPos.y - 1, currentPos.z))
      );
      boneMealUsed++;
    }
    console.log("fisinhed loop:   ", coralPicked, "   ", boneMealUsed);
  });
};

module.exports = { coralFarmer };
