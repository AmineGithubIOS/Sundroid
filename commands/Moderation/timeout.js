const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "timeout",
    description: "Timeout a user from the server.",
    permissions: "Temporarily exclude members",
    category: "Mod",
    perms: PermissionFlagsBits.KickMembers,
    options: [{
        name: "user",
        description: "The user to timeout from the server.",
        type: ApplicationCommandOptionType.User,
        required: true
    },{
        name: "time",
        description: "The duration for which the member will be timed out.",
        type: ApplicationCommandOptionType.String,
        required: true
    }, {
        name: "reason",
        description: "Reason for the timeout.",
        type: ApplicationCommandOptionType.String,
        required: false
    }],
    execute: async(client, interaction) => {
        const user = interaction.options.getUser("user")
        const times = interaction.options.getString("time")
        const time = ms(times)
        const reason = interaction.options.getString("reason") ? interaction.options.getString("reason") : "**No reason**"
        
        const member = interaction.guild.members.cache.get(user.id)
        const memberBot = interaction.guild.members.cache.get(client.user.id)
       
        try {
            if (user.bot) return interaction.reply({ content: `<:pointbleue:1129913618520092773> I do not have the **capability to timeout** a bot, please use **additional commands** such as </kick:1> or </ban:1>`, ephemeral: true })
            
            if (isNaN(time)) return interaction.reply({ content: `<:pointbleue:1129913618520092773> You must specify a **valid time format**: **10s, 10m, 10h, 10d**.\n\n> Tip: The maximum timeout duration is **28 days**.`, ephemeral: true })
            
            if (time >= 2419200000) return interaction.reply({ content: `<:pointbleue:1129913618520092773> The **maximum timeout duration** is \`28 days\`. You cannot exceed this limit.`, ephemeral: true })
            if (member.isCommunicationDisabled()) return interaction.reply({ content: `<:pointbleue:1129913618520092773> The member you are trying to **timeout is already timed out**, please reconsider your **choice**.`, ephemeral: true })
            
            if (user.id === interaction.user.id) return interaction.reply({ content: `<:pointbleue:1129913618520092773> You are trying to timeout yourself, I am **not capable of performing this action**.`, ephemeral: true })
        
            if (user.id === client.user.id) return interaction.reply({ content: `<:pointbleue:1129913618520092773> I do not have the capability to **self-timeout from a server**.`, ephemeral: true })
            
            if (!member) return interaction.reply({ content: `<:pointbleue:1129913618520092773> You are trying to timeout a member who **is not present on the server**, please double-check your **user object choice**.`, ephemeral: true })
            if (interaction.guild.fetchOwner()?.id === user.id || interaction.guild.roles?.comparePositions(member.roles.highest, interaction.member.roles.highest) >= 0) return interaction.reply({ content: `<:pointbleue:1129913618520092773> You are trying to timeout a user who is **hierarchically superior or equal** to you, please reconsider your **user object choice**`, ephemeral: true })
            if (interaction.guild.roles?.comparePositions(member.roles.highest, memberBot.roles.highest) >= 0) return interaction.reply({ content: `<:pointbleue:1129913618520092773> I cannot timeout a member who is **hierarchically superior or equal** to me, please reconsider my **permissions**.`, ephemeral: true })
            if (!memberBot.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: `<:pointbleue:1129913618520092773> To timeout members, I need the permission \`Temporarily exclude members\`, please **check my permissions**.`, ephemeral: true })
 
            member.timeout(time)
            interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Timeout for ${user.username}`).setURL(client.invite).setDescription(`The user **${user.username}** has been **timed out** on the server.\n\n> Moderator: ${interaction.user}\n> Duration: **${times}**\n> Reason: ${reason}`).setColor(client.color)]})

        } catch (err) {
            interaction.reply({ content: `<:pointbleue:1129913618520092773> An unexpected error occurred while **timing out** the user **${user.username}**.\n\n**Error code**: \`\`\`js\n${err}\`\`\``, ephemeral: true})
            console.log(err)
        }
    }
}