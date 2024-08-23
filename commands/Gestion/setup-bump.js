const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require("discord.js")
const bump = require("../../database/models/bump.js")

module.exports = {
    name: "setup-bump",
    description: "Allows you to configure the bump system",
    category: "gestion",
    perms: PermissionFlagsBits.Administrator,
    execute: async(client, interaction) => {
        let data = await bump.findOne({ guildId: interaction.guild.id })
        if(!data){
            data = new bump({
                guildId: interaction.guild.id
            })
        }
        const embed = new EmbedBuilder().setColor(client.color).setAuthor({name: `Bump System Setup`, iconURL: client.user.displayAvatarURL()}).addFields({name: "Presentation", value: `**The bump system allows you to highlight your server with an innovative and intuitive system.**`}, {name: "First of all", value: `**Before bumping, you will need to create an invite link for yourself.**`})
        
        const modal = new ModalBuilder().setTitle("Set a description").setCustomId("modal")
              const cmdSearch = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("message").setLabel("Please enter a description.").setStyle(TextInputStyle.Short).setPlaceholder("Join my beautiful server"))
              modal.addComponents(cmdSearch)
           
        const channelSelecte = new ChannelSelectMenuBuilder({
            custom_id: "channels",
            placeholder: "Select a channel",
            max_values: 1
        })
        
        const channelSelect = new ActionRowBuilder().addComponents(channelSelecte)
        
        const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setEmoji("📬").setLabel("Configure the bump channel").setStyle(1).setCustomId("channel"), new ButtonBuilder().setEmoji("📑").setLabel("Set a description").setStyle(3).setCustomId("msg"), new ButtonBuilder().setLabel("See the configurations").setStyle(2).setCustomId("see").setEmoji("👀"))
        
        const link = new ButtonBuilder().setLabel("Create a link").setStyle(2).setEmoji("🔄").setCustomId("link")
        
        const back = new ButtonBuilder().setCustomId("back").setLabel("Back").setEmoji("↩️").setStyle(1).setDisabled(true)
        
        const backs = new ActionRowBuilder().addComponents(back)
        
        const message = await interaction.reply({ embeds: [embed], components: [btn] })
        
        const collector = await message.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id })
        
        collector.on("collect", async(i) => {
     if(i.customId === "link"){
         const channel = interaction.guild.channels.cache.get(data.channelId)
         
         if(!channel) return i.reply({ content: `**You must first define a room before creating the link.**` , ephemeral: true })
         
         const lien = await channel.createInvite({ maxAge: 0 })
         data.link = lien
         data.save()
         i.reply({ content: `**Your link has been created successfully** [Click here](${lien.url}) (${lien.url})`, ephemeral: true})
     }
     if(i.customId === "channels"){
      data.channelId = i.values[0]
      const channelValid = interaction.guild.channels.cache.get(i.values[0])
      
      if(!channelValid) return i.reply({ content: `**The channel defined is invalid, please select or create a new one.**`, ephemeral: true })
       if(channelValid.type !== ChannelType.GuildText) return i.reply({ content: `**You must select a text channel for the bump channel.**`, ephemeral: true })
      data.save()
      i.reply({ embeds: [new EmbedBuilder().setColor(client.color).setAuthor({name: `Channel set successfully`, iconURL: client.user.displayAvatarURL()}).setDescription(`**Bumps will now be sent to the channel <#${i.values[0]}>**`)], ephemeral: true})
        }
        if(i.customId === "back"){
            back.setDisabled(true)
            await i.update({ embeds: [embed], components: [btn]})
            }
        if(i.customId === "msg"){
           await i.showModal(modal)
    client.on("interactionCreate", async(interaction) => {
   if(interaction.isModalSubmit()){
      if(interaction.customId === "modal"){
          const textInput = interaction.fields.getTextInputValue("message")
       data.description = textInput
       data.save()
  interaction.reply({ embeds: [new EmbedBuilder().setColor(client.color).setAuthor({name: `Description set successfully`, iconURL: client.user.displayAvatarURL()}).setDescription(`${textInput}`)], ephemeral: true })
          }
   }
})
        }
      if(i.customId === "see"){
          const newButton = new ActionRowBuilder().addComponents(back)
          back.setDisabled(false)
     await i.update({ embeds: [new EmbedBuilder().setColor(client.color).setAuthor({name: `Bump System Setup`, iconURL: client.user.displayAvatarURL()}).addFields({name: "Bump channel", value: `\`\`\`\nSalon: #${client.channels.cache.get(data.channelId)?.name || "None"}\`\`\``}, { name: "Description", value: `\`\`\`\n${data.description ? data.description : "None" || "None"}\`\`\``}, { name: "invite link", value: `${data.link || "```\nNone.```"}`})], components: [newButton] })
      }
      if(i.customId === "channel"){
          back.setDisabled(false)
          backs.addComponents(link)
          await i.update({ embeds: [], components: [channelSelect, backs] })
        }
        })
        
    }
}