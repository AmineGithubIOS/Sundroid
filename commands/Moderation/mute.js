const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: "mute",
    description: "Mute a user in the server.",
    permissions: "Kick members",
    category: "Mod",
    perms: PermissionFlagsBits.KickMembers,
    options: [{
        name: "user",
        description: "The user to be muted in the server.",
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: "reason",
        description: "Reason for the mute.",
        type: ApplicationCommandOptionType.String,
        required: false
    }],
    execute: async (client, interaction) => {
        const user = interaction.options.getUser("user")
       
        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason") : "**No reason**"
        
        const member = interaction.guild.members.cache.get(user.id)
        const memberBot = interaction.guild.members.cache.get(client.user.id)
       
        try {
            if (user.bot) return interaction.reply({ content: `<:bluepoint:1129913618520092773> I don't have the ability to **mute** a bot, please use additional **commands** like: </kick:1> or </ban:1>`, ephemeral: true })
            if (member.isCommunicationDisabled()) return interaction.reply({ content: `<:bluepoint:1129913618520092773> The member you're trying to **mute is already muted**, please reconsider your **choice**.`, ephemeral: true })
            
            if (user.id === interaction.user.id) return interaction.reply({ content: `<:bluepoint:1129913618520092773> You're trying to mute yourself, I'm not **able to perform this action**.`, ephemeral: true})
        
            if (user.id === client.user.id) return interaction.reply({ content: `<:bluepoint:1129913618520092773> I don't have the ability to **self-mute from a server**. xD`, ephemeral: true })
            
            if (!member) return interaction.reply({ content: `<:bluepoint:1129913618520092773> You're trying to mute a member who **isn't present on the server**, please double-check your choice of **user object**.`, ephemeral: true})
            
            if (interaction.guild.fetchOwner()?.id === user.id || interaction.guild.roles?.comparePositions(member.roles.highest, interaction.member.roles.highest) >= 0) return interaction.reply({ content: `<:bluepoint:1129913618520092773> You're trying to mute a user who is **higher or equal in hierarchy** to you, please reconsider your choice of **user object**.`, ephemeral: true })
            
            if (interaction.guild.roles?.comparePositions(member.roles.highest, memberBot.roles.highest) >= 0) return interaction.reply({ content: `<:bluepoint:1129913618520092773> I can't mute a member who is **higher or equal in hierarchy** to me, please reconsider my **permissions**.`, ephemeral: true })
            
            if (!memberBot.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ content: `<:bluepoint:1129913618520092773> To mute members, I need the \`Kick Members\` permission, please **check my permissions**.`, ephemeral: true })
 
            member.timeout(2419200000)
            interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Muting of ${user.username}`).setURL(client.invite).setDescription(`The user **${user.username}** has been **muted** on the server.\n\n> Moderator: ${interaction.user}\n> Time: **28 days**\n> Reason: ${reason}`).setColor(client.color)]})
        } catch (err) {
            interaction.reply({ content: `<:bluepoint:1129913618520092773> An unexpected error occurred while **muting** the user **${user.username}**.\n\n**Error code**: \`\`\`js\n${err}\`\`\``, ephemeral: true})
        }
    }
}