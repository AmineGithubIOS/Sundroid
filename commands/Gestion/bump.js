const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require("discord.js")
const bump = require("../../database/models/bump.js")

module.exports = {
    name: "bump",
    description: "Allows you to bump your server",
    cooldown: "2h",
    category: "gestion",
    execute: async(client, interaction) => {
        let data = await bump.findOne({ guildId: interaction.guild.id })
        if(!data) return interaction.reply({ content: `**The bump system has not yet been configured, please ask an administrator to do so.**`, ephemeral: true })
        const channel = interaction.guild.channels.cache.get(data.channelId)
        if(!data.channelId) return interaction.reply({ content: `**You must define a bump arrival channel before you can bump.**`, ephemeral: true })
                
        const toIgnore = [interaction.guild.id, "766748363797299290"]
        const datas = await bump.find({ guildId: { $nin: toIgnore} })
        
     const boutons = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel(`Add ${client.user.username}`).setURL("https://discord.com/api/oauth2/authorize?client_id=1125465861440938095&permissions=8&scope=bot").setStyle(5).setEmoji("🌍"), new ButtonBuilder().setEmoji("📡").setURL(data.link).setLabel(interaction.guild.name).setStyle(5))
     
     datas.forEach(async (d) => {
    const targetChannel = await client.channels.cache.get(d.channelId);
    if (targetChannel) {
    await targetChannel.send({content: `${data.link}`, embeds: [new EmbedBuilder().setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() }).addFields({ name: `General informations`, value: `> **[${interaction.guild.name}](${data.link}) was bumped !\n> This server was created at <t:${Math.floor(interaction.guild.createdTimestamp/1000)}:R>\n> This server has ${interaction.guild.memberCount} members**`}, { name: `Description`, value: `${data.description}` }).setFooter({ text: `Bump by : ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()}).setColor(client.color)], components: [boutons] }).catch(err => {});
    }
})
        data.lastChannel = interaction.channel.id
        data.lastUser = interaction.user.id
        data.lastTime = Date.now()
        data.bump += 1
        data.save()
        
        const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Join support").setEmoji("✨").setCustomId("join").setStyle(1))
        
        const msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Join support for latest update`).setURL(client.invite).setDescription(`> **Your server has been successfully bumped in \`${client.ws.ping}\` ms**\n\n> **You can readjust the bump system configurations with the command </setup-bump:1>**`).setColor(client.color).setAuthor({ name: `${interaction.guild.name} has been bumped`, iconURL: interaction.guild.iconURL() }).setTimestamp()], ephemeral: false, components: [boutons] })
        
        const collector = await msg.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id })
   collector.on("collect", async (i) => {
       if(i.customId === "join"){
           btn.components.forEach(x => x.setDisabled(true))
           msg.edit({ components: [btn]})
           i.reply({ content: client.invite, ephemeral: true })
       }
   })
        const { QuickDB } = require("quick.db")
const db = new QuickDB()
const ms = require("ms")
const cooldownKey = `${module.exports.name}-${interaction.guild.id}`
const cooldownExpiration = Date.now() + ms(module.exports.cooldown) * 1000;
    await db.set(cooldownKey, cooldownExpiration);
        }
}