const ms = require("ms")
const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder, Collection } = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()
const captcha = require("./database/models/captcha.js");

module.exports = {
    name: "captchaInvalid",
    execute: async(member, captchaChannel, invalidCode, validCode) => {
        const data = await captcha.findOne({ guildId: member.guild.id })
    try {
        const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("sentfrom").setLabel(`Sent from: ${member.guild.name}`).setDisabled(true).setStyle(2))
  
    if(data.fails === "kick"){
    const msg = await captchaChannel.send({ embeds: [new EmbedBuilder().setDescription(`**You failed the captcha, you will be kick in a few seconds, to try your luck again, look in \`DM\`**`).setColor(client.color).setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL()})] })
    
    setTimeout(async() => {
        msg.delete()
        member.kick()
        const link = await captchaChannel.createInvite({ maxAge: 0 })
        member.send({ embeds: [new EmbedBuilder().setDescription(`**You failed the captcha on the server \`${member.guild.name}\`, so you have been kicked, you can still join the server by clicking [here](${link.url}).**`).setColor(client.color).setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL()})], components: [btn]})
    }, 3500)
      return;
    }
        
    if(data.fails === "ban"){
       const msg = await captchaChannel.send({ embeds: [new EmbedBuilder().setDescription(`**You failed the captcha, you will be ban in a few seconds.**`).setColor(client.color).setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL()})]}
         )
    
    setTimeout(() => {
        msg.delete()
        member.ban()
        member.send({ embeds: [new EmbedBuilder().setDescription(`**You failed the captcha on the server \`${member.guild.name}\`, so you have been banned.**`).setColor(client.color).setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL()})], components: [btn]})
    }, 3500)
       return;
   }
      } catch(e){
            console.log(e)
        }
    }
}