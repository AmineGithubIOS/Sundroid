const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js")

module.exports = {
    name: "messageCreate",
    once: false,
    execute: async (message, client) => {
     if(message.author.bot) return;
    const args = message.content.slice(" ")
    const salutations = ["Salut", "Yo", "Bonsoir", "Bonjour", "Hello", "Hi"];
if (salutations.some(salutation => message.content.includes(salutation))) {
  return message.react("👋");
}
       const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Join my support").setEmoji("📬").setStyle(5).setURL(client.invite))
        if(message.content.includes(client.user)) return message.reply({ embeds: [new EmbedBuilder().setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL()}).setDescription(`> **Hi ${message.author}, I am a multifunction bot mainly based on moderation, bumping. Add me [here](https://discord.com/api/oauth2/authorize?client_id=1125465861440938095&permissions=8&scope=bot).**`).setColor(client.color)], components: [btn] })
    
    }
}