const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
        name: "role-remove",
        description: "Remove a role from a member in the server",
        category: "Mod",
        perms: PermissionFlagsBits.ManageRoles,
        options: [{
            name: "user",
            description: "The user from whom to remove the role.",
            type: 6,
            required: true
        }, {
            name: "role",
            description: "The role to be removed from the member.",
            type: 8,
            required: true
     }],
    execute: async (client, interaction) => {
        const role = interaction.options.getRole("role")
        const member = interaction.options.getMember("user")
        if (!member) return interaction.reply({ content: `**The member you specified is not on the server.**`, ephemeral: true })
        const memberBot = interaction.guild.members.cache.get(client.user.id)
            
        if (interaction.guild.roles?.comparePositions(role, memberBot.roles.highest) >= 0) return interaction.reply({ content: `**I cannot remove a role from a user higher or equal to mine.**`, ephemeral: true })
            
        if (interaction.guild.roles?.comparePositions(role, interaction.member?.roles.highest) >= 0) return interaction.reply({ content: `**You cannot remove a role higher or equal to yours.**`, ephemeral: true })
            
        if (interaction.guild.roles?.comparePositions(member.roles.highest, interaction.member?.roles.highest) >= 0) return interaction.reply({ content: `**You cannot remove a role from a user higher than you.**`, ephemeral: true })
        
        if (!member.roles.cache.has(role.id)) return interaction.reply({ content: `**The member ${member} doesn't have the ${role} role, so it cannot be removed from them.**`, ephemeral: true })
            
        member.roles.remove(role)
        interaction.reply({ embeds: [new EmbedBuilder().setAuthor({name: `Role Removed: ${role.name}`, iconURL: client.user.displayAvatarURL()}).setDescription(`**The ${role} role has been successfully removed from the member ${member}**`).setColor(client.color)]})
    }
}