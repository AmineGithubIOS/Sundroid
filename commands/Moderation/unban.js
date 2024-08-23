const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: "unban",
    description: "Unban a user from the server.",
    category: "Mod",
    permissions: "Ban members",
    perms: PermissionFlagsBits.BanMembers,
    options: [{
        name: "user",
        description: "The user to unban from the server.",
        type: ApplicationCommandOptionType.User,
        required: true
    }],
    execute: async(client, interaction) => {
        const user = interaction.options.getUser("user")
        
        const member = interaction.guild.members.cache.get(user.id)
       
        const memberBot = interaction.guild.members.cache.get(client.user.id)
       
        try {
        
            if (user.id === client.user.id) return interaction.reply({ content: `<:pointbleue:1129913618520092773> I do not have the capability to **self-unban from a server**.`, ephemeral: true })
            
            if (member) return interaction.reply({ content: `<:pointbleue:1129913618520092773> You are trying to unban a member who is **not banned on the server**, please double-check your **user object choice**.`, ephemeral: true})
   
            if (!memberBot.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: `<:pointbleue:1129913618520092773> To unban users, I need the permission \`Ban members\`, please **check my permissions**.`, ephemeral: true })
 
            interaction.guild.members.unban(user)
            interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Unbanning ${user.username}`).setURL(client.invite).setDescription(`The user **${user.username}** has been unbanned from the server.\n\n> Moderator: **${interaction.user}**`).setColor(client.color)]})

        } catch(err){
            interaction.reply({ content: `<:pointbleue:1129913618520092773> An unexpected error occurred while **unbanning** the user **${user.username}**.\n\n**Error code**: \`\`\`js\n${err}\`\`\``, ephemeral: true})
        }
    }
}