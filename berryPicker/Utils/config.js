const { token } = require("./credentials");

const pass = "minecraft123";

const version = "1.20.1";

const channelId = "833669360069509160";

const safeMovements = {
  allowSprinting: false,
  allowParkour: false,
  canDig: true,
  allow1by1towers: false,
  maxDropDown: 2,
  blocksCantBreak: new Set([9, 8, 4, 46]),
};
const fastMovemets = {
  allowSprinting: true,
  walkSpeed: 5,
  allowParkour: true,
  canDig: true,
  allow1by1towers: false,
  maxDropDown: 4,
  blocksCantBreak: new Set([9, 8, 4, 46]),
};
const port = 5555;
const host = "127.0.0.1";
const username = "Berserker321";

// const username = "Berserker321";
// const host = "iskyblock.pl";
// const port = 25565;
// const cutPoint = { x: 6122, y: 85, z: 6469 };
// const tossingPoint = { x: 6122, y: 74, z: 6456 };
// const startC = { x: 6111, y: 74, z: 6473 };
// const endC = { x: 6112, y: 74, z: 6474 };

// const username = "Berserker321";
// const host = "mcosada.pl";
// const port = 25565;
// const cutPoint = { x: 6122, y: 85, z: 6469 };
// const tossingPoint = { x: 6122, y: 74, z: 6456 };
// const startC = { x: 6111, y: 74, z: 6473 };
// const endC = { x: 6112, y: 74, z: 6474 };
// const mushC = {x:76104,y:65,z:7}
// const muchChestC = {x:76105,y:66,z7}
module.exports = {
  username,
  pass,
  host,
  port,
  version,
  token,
  channelId,
  safeMovements,
  fastMovemets,
};
