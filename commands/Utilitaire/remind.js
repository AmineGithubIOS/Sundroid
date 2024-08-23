const ms = require("ms")
const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: "remind",
    description: "Schedule a reminder for your tasks",
    category: "Utils",
    options: [{
        name: "time",
        description: "How soon do I have to remind you",
        type: 3,
        required: true
    }, {
        name: "message",
        description: "The reminder message",
        type: 3,
        required: true
    }],
    execute: async(client, interaction) => {
        const times = interaction.options.getString("time")
        const reason = interaction.options.getString("message")
        const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Join Support").setStyle(1).setCustomId("invite").setEmoji("✨"))
        
        const time = ms(times)
        if(isNaN(time)) return interaction.reply({ content: `**You must specify a valid time.**`, ephemeral: true})
        const msg = await interaction.reply({ content: `**${interaction.user}, it's noted, I'll remind you in <t:${Math.floor(Date.now()/1000 + time/1000)}:F> (<t:${Math.floor(Date.now()/1000 + time/1000)}:R>)**`, components: [btn] })
        const collector = await msg.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id })
     collector.on("collect", async(i) => {
         if(i.customId === "invite"){
     i.reply({ content: client.invite, ephemeral: true })
             
  btn.components.forEach((x) => {
      x.setDisabled(true)
  })
    msg.edit({ components: [btn] })
             }
     })
        
        setTimeout(() => {
            try {
 interaction.user?.send({ embeds: [new EmbedBuilder().setAuthor({name: `Reminder Schedule`, iconURL: client.user.displayAvatarURL()}).setDescription(` ${reason}\n\n**Program : <t:${Math.floor(Date.now()/1000 + time/1000)}:R>**`).setColor(client.color)]})
        } catch(err){
            console.log(err)
        }
        }, time)
    }
}