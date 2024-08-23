const ms = require("ms")
const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder, Collection } = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        const cooldowns = new Collection();
        await slashCommands();
        async function slashCommands() {
            if(interaction.isChatInputCommand()) {

                const cmd = client.slashCommands.get(interaction.commandName);
                if(!cmd) {
                    return interaction.channel.send({ content: `\`[⌛]\` ${interaction.member}, an error has occured.` })
                }
       const cooldownKey = `${cmd.name}-${interaction.guild.id}`
     if (cmd.cooldown) {
      if (await db.get(cooldownKey)) {
  const cooldownExpiration = await db.get(cooldownKey);
  if (cooldownExpiration >= Date.now()) {
     
      return interaction.reply({embeds: [new EmbedBuilder().setDescription(`**You are under a cooldown, please try again in <t:${Math.floor(Date.now()/1000 + ms(cmd.cooldown)/1000)}:F> (<t:${Math.floor(Date.now()/1000 + ms(cmd.cooldown)/1000)}:R>)**`).setColor(client.color).setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })]});
  }
      }
           }
           
           if(cmd.perms){
if(!interaction.member.permissions.has(cmd.perms)){

interaction.reply({embeds: [new EmbedBuilder().setDescription(`**You do not have the required permission to run this command.**`).setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()}).setColor(client.color)], ephemeral: true})

    return;
}
    }
                const args = [];

                for (let option of interaction.options.data) {
                    if (option.type === 1) {
                        if (option.name) args.push(option.name);
                        option.options?.forEach((x) => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }
                interaction.member = interaction.guild.members.cache.get(interaction.user.id)
                
       console.log(`[SLASH COMMANDS] `.bold.red + `/${cmd.name}`.bold.blue + ` has been executed`.bold.white)
 cmd.execute(client, interaction);
 
 

  }
                
            }
        }

    }
