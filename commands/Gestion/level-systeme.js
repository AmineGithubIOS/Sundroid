const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "config-level",
    description: "Allows you to config the level system",
    perms: PermissionFlagsBits.Administrator,
    execute: async(client, interaction) => {
        const components = new ActionRowBuilder()
        const embed = new EmbedBuilder().setColor(client.color).setDescription("Cet embed te permet de configurer le systeme de level, il est en construction pour le moment")
        interaction.reply({embed: [embed]})
    }
}