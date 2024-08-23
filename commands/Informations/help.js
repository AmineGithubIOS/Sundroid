const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")

module.exports = {
  name: "help",
  description: "Display all of bot command",
  category: "Info",
  execute: async (client, interaction) => {
      const menu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId("menu").addOptions(new StringSelectMenuOptionBuilder().setValue("why").setEmoji("❓").setLabel("Why add me to your server ?"), new StringSelectMenuOptionBuilder().setEmoji("🛡️").setValue("modo").setLabel("Moderation command"), new StringSelectMenuOptionBuilder().setEmoji("🔩").setValue("utils").setLabel("Utilities Command"), new StringSelectMenuOptionBuilder().setEmoji("ℹ️").setValue("info").setLabel("Information command"), new StringSelectMenuOptionBuilder().setEmoji("📁").setValue("eco").setLabel("Management command")))
      const back = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Back").setStyle(1).setCustomId("back").setEmoji("↩️")) 
      const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Support").setEmoji("✨").setCustomId("join").setStyle(1), new ButtonBuilder().setEmoji("🤖").setLabel("Invite").setURL(client.invite).setStyle(5), new ButtonBuilder().setLabel("Find an commands").setEmoji("🔍").setStyle(3).setCustomId("search"))
    const commandsByCategory = {};
    const slashCommands = client.slashCommands;

    slashCommands.forEach(cmd => {
      if (!commandsByCategory[cmd.category]) {
        commandsByCategory[cmd.category] = [];
      }
      commandsByCategory[cmd.category].push(cmd);
    });

    const moderationCommands = commandsByCategory['Mod'];
    const informationCommands = commandsByCategory['Info'];
    const utilsCommands = commandsByCategory['Utils'];
    const ecoCmds = commandsByCategory["gestion"]
   const embed = new EmbedBuilder().setTitle("List of bot commands").setURL(client.invite).setDescription(`**You want to have a versatile bot with unique commands and an intuitive interface, \`${client.user.username}\` is for you. Also, already \`${client.guilds.cache.size}\` servers trust us.**`).setImage(client.image).setColor(client.color).setAuthor({name: `Full list of bot commands`, iconURL: client.user.displayAvatarURL()}).setFooter({text: client.user.username , icinURL: client.user.displayAvatarURL()}).setTimestamp()
   
    const msg = await interaction.reply({ embeds: [embed], components: [menu, btn] });
     
      const collector = await msg.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 100000 })
      collector.on("collect", async(i) => {
         if(i.customId === "menu"){
             if(i.values[0] === "modo") return i.update({ embeds: [new EmbedBuilder().setDescription(`${utilsCommands.map(x => `**</${x.name}:1>\n> Description : ${x.description}**`).join("\n\n")}`).setAuthor({ name: `List of utility commands.`, iconURL: client.user.displayAvatarURL()}).setColor(client.color)], components: [back] })
             if(i.values[0] === "eco") return i.update({ embeds: [new EmbedBuilder().setDescription(`${ecoCmds.map(x => `**</${x.name}:1>\n> Description : ${x.description}**`).join("\n\n")}`).setAuthor({ name: `List of management commands.`, iconURL: client.user.displayAvatarURL()}).setColor(client.color)], components: [back] })
             if(i.values[0] === "utils") return i.update({ embeds: [new EmbedBuilder().setDescription(`${moderationCommands.map(x => `**</${x.name}:1>\n> Description : ${x.description}**`).join("\n\n")}`).setAuthor({ name: `List of moderation commands`, iconURL: client.user.displayAvatarURL()}).setColor(client.color)], components: [back] })
             if(i.values[0] === "info") return i.update({ embeds: [new EmbedBuilder().setDescription(`${moderationCommands.map(x => `**</${x.name}:1>\n> Description : ${x.description}**`).join("\n\n")}`).setAuthor({ name: `List of information commands`, iconURL: client.user.displayAvatarURL()}).setColor(client.color)], components: [back] })
             if(i.values[0] === "why") return i.reply({ embeds: [new EmbedBuilder().setAuthor({ name: `Why add SunDroid`, iconURL: client.user.displayAvatarURL() }).setDescription(`**SunDroid is a bot based on management, bump, moderation, it will allow you to easily manage your server with great simplicity, moreover, \`${client.guilds.cache.size}\` server**`).setColor(client.color)], ephemeral: true})
         }
         if(i.customId === "join"){
          i.reply({ content: `${client.invite}`, ephemeral: true})
             }
         if(i.customId === "back"){
             i.update({ embeds: [embed], components: [menu, btn]})
         }
       if(i.customId === "search"){
              const modal = new ModalBuilder().setTitle("Order search").setCustomId("modal")
              const cmdSearch = new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("cmdTo").setLabel("Please enter the command name.").setStyle(TextInputStyle.Short).setPlaceholder("Enter the command name"))
              modal.addComponents(cmdSearch)
           await i.showModal(modal)
           
client.on("interactionCreate", async(interaction) => {
    if (!interaction.isModalSubmit()) return;
    const input = interaction.fields.getTextInputValue('cmdTo').toLowerCase();
    const cmd = client.slashCommands.get(input)
    if(!cmd) return interaction.reply({ content: `**No command with the name \`${input}\` was found.**`, ephemeral: true})
    if(cmd){
        const toCat = cmd.category
        let real = ""
        switch(toCat){
               case "Mod":
               real = "Moderation"
               break;
               case "Info":
               real = "Information"
               break;
               case "Utils":
               real = "Utilitie"
               break;
               case "gestion":
               real = "Management"
               break;
                default:
                real = "Category unknown"
                break;
        }
  interaction.reply({ embeds: [new EmbedBuilder().setAuthor({ name: `Commands found.`, iconURL: client.user.displayAvatarURL()}).setDescription(`**> Command name : ${cmd.name}\n> Description : ${cmd.description}\n> Category : ${real}**`).setColor(client.color)], ephemeral: true})
    }
})
          }
      })
   collector.on("end", async() => {
btn.components.forEach(async(x) => { x.setDisabled(true) })
       menu.components.forEach(async(x) => { x.setDisabled(true) })
       msg.edit({ components: [menu, btn]})
   })
  }
}
