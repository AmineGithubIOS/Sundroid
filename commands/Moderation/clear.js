const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: "clear",
    description: "Delete multiple messages from a channel",
    permissions: "Manage messages",
    category: "Mod",
    perms: PermissionFlagsBits.ManageMessages,
    options: [{
        name: "messages",
        description: "The number of messages to delete",
        type: ApplicationCommandOptionType.Number,
        required: true
    }],
    execute: async(client, interaction) => {
        const num = interaction.options.getNumber("messages")
        if (num > 100 || num === 0) return interaction.reply({ content: `**<:pointbleue:1129913618520092773> The maximum number of message deletion is \`99\` and the minimum is \`1\` message.**`, ephemeral: true })
        const channel = client.channels.cache.get(interaction.channel.id)
  
        
        const deleteMessages = await interaction.channel.bulkDelete(num)
        
        const msg = await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Message Deletion`).setURL(client.invite).setDescription(`**A total of \`${deleteMessages.size}\` messages have been successfully deleted.\n\n> Moderator: ${interaction.user}\n> Count: \`${deleteMessages.size}\`**`).setColor(client.color)]})
        setTimeout(async () => {
            await msg.delete()
        }, 3500)
    }
}