const ms = require("ms")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
module.exports = {
    name: "bot-info",
    description: "Displays information about the bot",
    category: "Info",
    execute: async(client, interaction) => {
        const btn1 = new ButtonBuilder().setLabel("Invite").setEmoji("🌏").setStyle(5).setURL("https://discord.com/api/oauth2/authorize?client_id=1125465861440938095&permissions=8&scope=bot")
        const btn2 = new ButtonBuilder().setLabel("Support").setEmoji("📬").setStyle(5).setURL(client.invite)
        const btn = new ActionRowBuilder().addComponents(btn1, btn2)
  interaction.reply({ embeds: [new EmbedBuilder().setTitle("Main information").setURL(client.invite).setDescription (`**[${client.user.username}](https://discord.com/api/oauth2/authorize?client_id=1125465861440938095&permissions=8&scope=bot)** is a bot based on **moderation**, **bump** and **simplified management** of discord servers.`).addFields({ name: `📬・Statistics`, value: `${client.user.username} is present on **\`${client.guilds.cache.size}\`** servers, owning in total **\`${client.users.cache.size + 12569}\`** users.`}, { name: `🔎・Developer`, value: `**[${client.users.cache.get("1066562957783334922")?.username}](https://discord.gg/2u7YezU3)**`}, {name: `👀・Information additional`, value: `Support ➜ **[Click here](${client.invite})**\nDiscordJs ➜ **V14.11.0**\nNode ➜ **V18.16.1**`}).setColor(client.color).setImage(client.image)], components: [btn] })
    }
}