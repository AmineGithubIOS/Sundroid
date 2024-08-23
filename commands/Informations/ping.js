const ms = require("ms")

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")

module.exports = {
    name: "ping",
    description: "Display the bot latency",
    category: "Info",
    execute: async(client, interaction) => {
   interaction.reply({ embeds: [new EmbedBuilder().setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL()}).setDescription(`**API latency : \`${client.ws.ping}\` ms**`).setColor(client.color)] })
    }
}