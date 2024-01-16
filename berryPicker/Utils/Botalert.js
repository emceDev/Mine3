const enableAlert = (bot, whitelist, dcSend) => {
  console.log("scan on");

  const scan = setInterval(() => {
    const detectionRange = 1; // Adjusted the detection range as per your comment

    // Get a list of all entities in the bot's vicinity
    const nearbyEntities = bot.entities;
    // Filter the nearby entities to find players within the detection range
    const nearbyPlayers = Object.values(nearbyEntities).filter((entity) => {
      return (
        entity.type === "player" &&
        entity.username !== bot.username &&
        bot.entity.position.distanceTo(entity.position) < detectionRange
      );
    });

    let foundNonWhitelistedPlayer = false;

    for (const player of nearbyPlayers) {
      // Handle the detected player here
      dcSend(
        `Detected player: ${player.username} at position: ${player.position}`
      );

      // Check if the detected player is not on the whitelist
      if (!whitelist.includes(player.username)) {
        foundNonWhitelistedPlayer = true;
      }
    }

    // Quit the bot only if a non-whitelisted player is found within the range
    if (foundNonWhitelistedPlayer) {
      clearInterval(scan);
      bot.quit();
      dcSend("Someone joined the island.");
    }
  }, 2000);
};

module.exports = { enableAlert };
