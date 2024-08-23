const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: "kick",
    description: "Kick a user from the server.",
    permissions: "Kick members",
    category: "Mod",
    perms: PermissionFlagsBits.KickMembers,
    options: [{
        name: "user",
        description: "The user to be kicked from the server.",
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: "reason",
        description: "Reason for the kick.",
        type: ApplicationCommandOptionType.String,
        required: false
    }],
    execute: async (client, interaction) => {
        const user = interaction.options.getUser("user")
       
        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason") : "**No reason**"
        
        const member = interaction.guild.members.cache.get(user.id)
        const memberBot = interaction.guild.members.cache.get(client.user.id)
       
        try {
            if (user.id === interaction.user.id) return interaction.reply({ content: `<:bluepoint:1129913618520092773> You're trying to kick yourself, I'm not **able to perform this action**.`, ephemeral: true})
        
            if (user.id === client.user.id) return interaction.reply({ content: `<:bluepoint:1129913618520092773> I don't have the ability to **self-kick from a server**. xD`, ephemeral: true })
            
            if (!member) return interaction.reply({ content: `<:bluepoint:1129913618520092773> You're trying to kick a member who **isn't present on the server**, please double-check your choice of **user object**.`, ephemeral: true})
            
            if (interaction.guild.fetchOwner()?.id === user.id || interaction.guild.roles?.comparePositions(member.roles.highest, interaction.member.roles.highest) >= 0) return interaction.reply({ content: `<:bluepoint:1129913618520092773> You're trying to kick a user who is **higher or equal in hierarchy** to you, please reconsider your choice of **user object**.`, ephemeral: true })
            
            if (interaction.guild.roles?.comparePositions(member.roles.highest, memberBot.roles.highest) >= 0) return interaction.reply({ content: `<:bluepoint:1129913618520092773> I can't kick a member who is **higher or equal in hierarchy** to me, please reconsider my **permissions**.`, ephemeral: true })
            
            if (!memberBot.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ content: `<:bluepoint:1129913618520092773> To kick members, I need the \`Kick Members\` permission, please **check my permissions**.`, ephemeral: true })
 
            member.kick()
            interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Kick of ${user.username}`).setURL(client.invite).setDescription(`The user **${user.username}** has been kicked from the server.\n\n> Moderator: ${interaction.user}\n> Reason: **${reason}**\n\n`).setColor(client.color)]})
        } catch (err) {
            interaction.reply({ content: `<:bluepoint:1129913618520092773> An unexpected error occurred while **kicking** the user **${user.username}**.\n\n**Error code**: \`\`\`js\n${err}\`\`\``, ephemeral: true})
        }
    }
}