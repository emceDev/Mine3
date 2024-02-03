const { token } = require("./credentials");

const port = 25565;

const username = "grzesiuKartofel";
const pass = "jestGrane1";
// const username = "Berserker321";
// const pass = "minecraft123";

// const host = "127.0.0.1";
const host = "mcosada.pl";
// const host = "iskyblock.pl";
const version = "1.20.1";

const channelId = "833669360069509160";

const safeMovements = {
  allowSprinting: false,
  allowParkour: false,
  canDig: false,
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
