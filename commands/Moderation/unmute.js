const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: "unmute",
    description: "Unmute a user on the server.",
    category: "Mod",
    permissions: "Unmute members temporarily",
    perms: PermissionFlagsBits.KickMembers,
    options: [{
        name: "user",
        description: "The user to unmute on the server.",
        type: ApplicationCommandOptionType.User,
        required: true
    }, {
        name: "reason",
        description: "Reason for the unmute.",
        type: ApplicationCommandOptionType.String,
        required: false
    }],
    execute: async(client, interaction) => {
        const user = interaction.options.getUser("user")
       
        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason") : "**No reason**"
        
        const member = interaction.guild.members.cache.get(user.id)
        const memberBot = interaction.guild.members.cache.get(client.user.id)
       
        try {
            if (!member.isCommunicationDisabled()) return interaction.reply({ content: `<:pointbleue:1129913618520092773> The member you are trying to **unmute** is not muted. Please reconsider your **choice**.`, ephemeral: true })
            
            if (user.id === interaction.user.id) return interaction.reply({ content: `<:pointbleue:1129913618520092773> You are trying to unmute yourself, I am not **capable of performing this action**.`, ephemeral: true})
        
            if (user.id === client.user.id) return interaction.reply({ content: `<:pointbleue:1129913618520092773> I do not have the capability to **self-unmute from a server**.`, ephemeral: true })
            
            if (!member) return interaction.reply({ content: `<:pointbleue:1129913618520092773> You are trying to unmute a member who is **not present on the server**, please double-check your **user object choice**.`, ephemeral: true})
            if (interaction.guild.fetchOwner()?.id === user.id || interaction.guild.roles?.comparePositions(member.roles.highest, interaction.member.roles.highest) >= 0) return interaction.reply({ content: `<:pointbleue:1129913618520092773> You are trying to unmute a user who is **hierarchically superior or equal** to you, please reconsider your **user object choice**`, ephemeral: true })
            if (interaction.guild.roles?.comparePositions(member.roles.highest, memberBot.roles.highest) >= 0) return interaction.reply({ content: `<:pointbleue:1129913618520092773> I cannot unmute a member who is **hierarchically superior or equal** to me, please reconsider my **permissions**.`, ephemeral: true })
            if (!memberBot.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: `<:pointbleue:1129913618520092773> To unmute members, I need the permission \`Unmute members temporarily\`, please **check my permissions**.`, ephemeral: true })
 
            member.timeout(null)
            interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Restoration of ${user.username}'s Voice`).setURL(client.invite).setDescription(`The user **${user.username}** has just **regained their voice** on the server.\n\n> Moderator: ${interaction.user}\n> Reason: ${reason}`).setColor(client.color)]})

        } catch(err){
            interaction.reply({ content: `<:pointbleue:1129913618520092773> An unexpected error occurred while **unmuting** the user **${user.username}**.\n\n**Error code**: \`\`\`js\n${err}\`\`\``, ephemeral: true})
        }
    }
}