const ms = require("ms")
const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder, Collection } = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()
const captcha = require("./database/models/captcha.js");

module.exports = {
    name: "captchaSuccess",
    execute: async(member, captchaChannel) => {
        try {
            const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("sentfrom").setLabel(`Sent from: ${member.guild.name}`).setDisabled(true).setStyle(2))
            
     const data = await captcha.findOne({ guildId: member.guild.id })
     
     if(!data.roles) return;
     if(!data.role) return;
     
     const message = await captchaChannel.send({ embeds: [new EmbedBuilder().setDescription(`**✅ ${member} you have successfully completed the captcha, the roles will be added to you in a few seconds.**`).setColor(client.color).setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL()})] })
     
     setTimeout(() => {
         member.send({ embeds: [new EmbedBuilder().setDescription(`**✅ You have successfully completed the captcha on the server \`${member.guild.name}\`, the roles ${data.roles.map(e => `${member.guild.roles.cache.get(e)?.name}`).join(", ")} have been assigned to you.**`).setColor(client.color).setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL()})], components: [btn]})
         message.delete()
         const roleRemove = member.roles.cache.find(r => data.role)
         if(!roleRemove) return;
 member.roles.remove(roleRemove.id)
    data.roles.forEach((role) => {
        member.roles.add(role)
     })
     }, 3500)
            } catch(err){
                console.log(err)
            }
    }
}