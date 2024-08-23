const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require("discord.js")
const ms = require("ms")
const captcha = require("../../database/models/captcha.js")

module.exports = {
    name: "setup-captcha",
    description: "Allows you to setup captcha system to your server",
    category: "gestion",
    perms: PermissionFlagsBits.Administrator,
    execute: async(client, interaction) => {
        let data = await captcha.findOne({ guildId: interaction.guild.id })
        if(!data){
            data = new captcha({
                guildId: interaction.guild.id
            })
            data.save()
        }
        let kickOption = false
        let BanOption = false
        console.log(data)
        const select = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setPlaceholder("Captcha sentence configuration").setMaxValues(4).setMinValues(1).setCustomId("select").addOptions(new StringSelectMenuOptionBuilder().setDefault(data.sentence.includes("low")).setLabel("Lowercase characters").setValue("low"), new StringSelectMenuOptionBuilder().setDefault(data.sentence.includes("upper")).setLabel("Uppercase characters").setValue("upper"), new StringSelectMenuOptionBuilder().setDefault(data.sentence.includes("number")).setLabel("Number characters").setValue("number"), new StringSelectMenuOptionBuilder().setDefault(data.sentence.includes("symbol")).setLabel("Symbols characters").setValue("symbol")))
        
        const menu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setPlaceholder("Case if user fails captcha").setMaxValues(1).setMinValues(1).setCustomId("menu").addOptions(new StringSelectMenuOptionBuilder().setLabel("Kick the user").setDefault(data.fails === "kick").setValue("kick"), new StringSelectMenuOptionBuilder().setLabel("Ban the user").setValue("ban").setDefault(data.fails === "ban")))
        
        const roleSelect = new ActionRowBuilder().addComponents(new RoleSelectMenuBuilder().setCustomId("roleSelect").setMinValues(1).setMaxValues(interaction.guild.roles.cache.size > 25 ? 25 : interaction.guild.roles.cache.size))
        
        const roleSelect2 = new ActionRowBuilder().addComponents(new RoleSelectMenuBuilder().setCustomId("roleSelect2").setMinValues(1).setMaxValues(1))
        
        const channelSelect = new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId("channelSelect").setMinValues(1).setMaxValues(1))
        
        const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Set captcha characters length").setEmoji("📌").setStyle(2).setCustomId("length"), new ButtonBuilder().setEmoji("📬").setLabel(`Set captcha channel`).setStyle(1).setCustomId("channel"), new ButtonBuilder().setLabel(`Set response time (Current: 1m)`).setEmoji("⏲️").setStyle(1).setCustomId("time"), new ButtonBuilder().setLabel("Assign post-captcha role").setStyle(2).setEmoji("🎭").setCustomId("joinRole"), new ButtonBuilder().setLabel(">>").setStyle(3).setCustomId("row"))
        
        const btn2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("<<").setStyle(3).setCustomId("arrow"), new ButtonBuilder().setLabel("Set roles to give").setEmoji("🎭").setStyle(2).setCustomId("role"), new ButtonBuilder().setEmoji("🗑️").setLabel("Delete server configuration data").setStyle(4).setCustomId("delete"))
        
        const backs = new ButtonBuilder().setLabel("Back").setStyle(1).setEmoji("↩️").setCustomId("back")
        const back = new ActionRowBuilder().addComponents(backs)
        const embed = new EmbedBuilder().setDescription(`**The captcha system allows you to protect your guild against automated accounts.\n\n> A multitude of buttons are provided to allow easy configuration of the system.\n> This system can be complex for the new ones, and for that in case of need of help, [join the server support](${client.invite}).**`).setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() }).setColor(client.color)
        
        const embed2 = new EmbedBuilder().setColor("#FF0102").setDescription(`**⚠️ A bad configuration can cause the system to malfunction, if you encounter problems, do not hesitate to ask for help on the [support](${client.invite}).**`)
        
        const lengthModal = new ModalBuilder().setTitle("What will be the length of captcha characters").setCustomId("lengthModal")
        lengthModal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setLabel("Write sentence length number").setPlaceholder("8-12 maximum length").setCustomId("modalLength").setStyle(TextInputStyle.Short)))
        
        const timeModal = new ModalBuilder().setTitle("What will be the time to respond captcha").setCustomId("timeModal")
        timeModal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setLabel("Write the time here").setPlaceholder("60s 1m, 5m ...").setCustomId("timeLength").setStyle(TextInputStyle.Short)))
        
        const msg = await interaction.reply({ embeds: [embed], components: [menu, select, btn] })
        
        const collector = await msg.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id })
        collector.on("collect", async(i) => {
       if(i.customId === "row"){
          return i.update({ embeds: [embed],components: [btn2]})
      }
       if(i.customId === "arrow"){
           return i.update({ embeds: [embed], components: [menu, select, btn] })
       }
            if(i.customId === "back") return i.update({ embeds: [embed], components: [menu, select, btn]})
            if(i.customId === "channel") return i.update({ embeds: [new EmbedBuilder().setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL()}).setDescription(`**Please select a text channel for the captcha channel setup.**`).setColor(client.color)], components: [channelSelect, back] })
      if(i.customId === "length"){
     await i.showModal(lengthModal)
   client.on("interactionCreate", async(interaction) => {
            if(interaction.customId === "lengthModal"){
           const text = interaction.fields.getTextInputValue("modalLength")
           
           if(isNaN(text)){
               return interaction.reply({ content: `**You must provide a valid number for the captcha sentence length.**`, ephemeral: true })
               }
           if(text > 12){
               return interaction.reply({ content: `**The length of the captcha sentence cannot be greater than \`12\`.**`, ephemeral: true})
               }
      if(text < 12 && !isNaN(text)){
          data.length = text
          data.save()
          interaction.reply({ content: `**The captcha sentence length will now be \`${text}\` words.**`, ephemeral: true })
          }
            }
            })
            }
       if(i.customId === "time"){
     await i.showModal(timeModal)
           client.on("interactionCreate", async(interaction) => {

 if(!interaction.isModalSubmit()) return;
       if(interaction.customId === "timeModal"){
           const text = interaction.fields.getTextInputValue("timeLength")
           
           const time = ms(text)
           if(isNaN(time)){
               return interaction.reply({ content: `**You must provide a valid time for the captcha response time.**`, ephemeral: true })
               }
           
           if(time > ms("10m")){
               return interaction.reply({ content: `**The captcha response time cannot exceed \`10m\`.**`, ephemeral: true })
               }
  if(time < ms("10m") && !isNaN(time)){
           data.time = time
           data.save()
           interaction.reply({ content: `**The captcha response time will now be \`${text}\`**`, ephemeral: true })
      }
       }
           })
         }
            if(i.customId === "role") return i.update({ embeds: [new EmbedBuilder().setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL()}).setDescription(`**Please select role for the captcha role setup.**`).setColor(client.color)], components: [roleSelect, back] })
  if(i.customId === "roleSelect"){
     data.roles = []
     data.save().then(async() => {
      i.values.forEach(value => {
      data.roles.push(value)
          })
     data.save()
         })
        i.reply({ content: `**The following roles will be added to the member when he has passed the captcha : ${i.values.map(r => `<@&${r}>`).join(", ")}**`, ephemeral: true })
            } 
            if(i.customId === "channelSelect"){
                
      const channel = client.channels.cache.get(i.values[0])
      if(channel.type !== ChannelType.GuildText){
          return i.reply({ content: `**The channel must be a text channel.**`, ephemeral: true })
      }
      data.channelId = i.values[0]
       data.save()
       i.reply({ content: `**Newcomers will pass the captcha in the channel : <#${i.values[0]}>**`, ephemeral: true })
 }
  if(i.customId === "select"){
     data.sentence = []
     data.save().then(async() => {
    i.values.forEach((value) => {
    data.sentence.push(value)
        })
    data.save()
         })
      i.reply({ content: `**Your data has been saved : ${i.values.map(s => `\`${s}\``).join(", ")}**`, ephemeral: true })
    }
       if(i.customId === "menu"){
          data.fails = i.values[0]
          data.save()
           i.reply({ content: `**Your data has been saved in case the user fails the captcha.**`, ephemeral: true })
            }
      if(i.customId === "delete"){
          data.deleteOne()
          i.reply({ content: `**Your data has been reset, you can now redo all your configuration.**`, ephemeral: true })
      }
 if(i.customId === "joinRole"){
   return i.update({ embeds: [new EmbedBuilder().setDescription(`**Please select a role to add during the captcha.**`).setColor(client.color)], components: [roleSelect2, back]})
 }
 if(i.customId === "roleSelect2"){
    data.role = i.values[0]
    data.save()
    i.reply({ content: `**The following roles will be used as role captcha : ${i.values.map(r => `<@&${r}>**`).join(", ")}`, ephemeral: true })
}
        })
    }
}