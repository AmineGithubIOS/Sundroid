const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: "renew",
    description: "Renew a server channel",
    category: "Mod",
    permissions: "Manage channels",
    perms: PermissionFlagsBits.ManageChannels,
    options: [{
        name: "channel",
        description: "The server channel to be renewed",
        type: ApplicationCommandOptionType.Channel,
        required: false
    }],
    execute: async (client, interaction) => {
      
        const memberBot = interaction.guild.members.cache.get(client.user.id)
        if (!memberBot.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `<:bluepoint:1129913618520092773> To renew channels, I need the \`Manage Channels\` permission, please **check my permissions**.`, ephemeral: true })
        
        const channel = interaction.options.getChannel("channel") ? interaction.options.getChannel("channel") : interaction.channel
  
        channel.clone().then(async (newChannel) => {
            newChannel.setPosition(channel.position)
            const msg = await newChannel.send({ embeds: [new EmbedBuilder().setDescription(`**🧨 ${interaction.user}, the ${channel.name} channel (\`${channel.id}\`) has been successfully renewed**.`).setColor(client.color), new EmbedBuilder().setDescription(`**To stay informed about the **latest news** regarding the bot, join the [support server](${client.invite})**.`).setColor(client.color), new EmbedBuilder().setAuthor({name:"Information", iconURL: client.user.displayAvatarURL()}).setDescription(`These messages will be automatically deleted in **30 seconds**.`).setColor(client.color)]})
            setTimeout(() => {
                msg.delete()
            }, 30000)
        })
        
        channel.delete()
        
        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`**🧨 ${interaction.user}, the ${channel.name} channel (\`${channel.id}\`) has been successfully renewed**.`).setColor(client.color), new EmbedBuilder().setDescription(`**To stay informed about the **latest news** regarding the bot, join the [support server](${client.invite})**.`).setColor(client.color)], ephemeral: true }).catch(err => {})
    }
}