const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: "role-add",
    description: "Add a role to a member in the server",
    category: "Mod",
    perms: PermissionFlagsBits.ManageRoles,
    options: [{
            name: "user",
            description: "The user to whom the role will be added.",
            type: 6,
            required: true
        }, {
            name: "role",
            description: "The role to be added to the member.",
            type: 8,
            required: true
        }],

    execute: async (client, interaction) => {
        const role = interaction.options.getRole("role")
        const member = interaction.options.getMember("user")
        if (!member) return interaction.reply({ content: `**The member you specified is not on the server.**`, ephemeral: true })
        
        const memberBot = interaction.guild.members.cache.get(client.user.id)
            
        if (interaction.guild.roles?.comparePositions(role, memberBot.roles.highest) >= 0) return interaction.reply({ content: `**I cannot add a role to a user higher or equal to mine.**`, ephemeral: true })
            
        if (interaction.guild.roles?.comparePositions(role, interaction.member?.roles.highest) >= 0) return interaction.reply({ content: `**You cannot add a role higher or equal to yours.**`, ephemeral: true })
            
        if (interaction.guild.roles?.comparePositions(member.roles.highest, interaction.member?.roles.highest) >= 0) return interaction.reply({ content: `**You cannot add a role to a user higher than you.**`, ephemeral: true })
    
        if (member.roles.cache.has(role.id)) return interaction.reply({ content: `**The member ${member} already has the ${role} role, so it cannot be added to them again.**`, ephemeral: true })
            
        member.roles.add(role)
        interaction.reply({ embeds: [new EmbedBuilder().setAuthor({name: `Role Added: ${role.name}`, iconURL: client.user.displayAvatarURL()}).setDescription(`**The ${role} role has been successfully added to the member ${member}**`).setColor(client.color)]})
    }
}