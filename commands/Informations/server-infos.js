const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "server-info",
    description: "Get information about a server",
    category: "Info",
    execute: async (client, interaction) => {
        try {
        const guild = interaction.guild;
        let verif;

        if (guild.verificationLevel === 0) { verif = "None"; }
        if (guild.verificationLevel === 1) { verif = "Weak"; }
        if (guild.verificationLevel === 2) { verif = "Average"; }
        if (guild.verificationLevel === 3) { verif = "Higher"; }
        if (guild.verificationLevel === 4) { verif = "Higher"; }


        interaction.reply({
            embeds: [
                new EmbedBuilder().setImage(guild.bannerURL() || client.image).setColor(client.color).setAuthor({
                    name: `${interaction.guild.name}`,
                    iconURL: interaction.guild.iconURL()
                }).addFields({
                    name: `General informations`,
                    value: `> **Name** : ${guild.name}\n> **Owner** : <@${guild.ownerId}> (\`${guild.ownerId}\`)\n> **Verification level** : ${verif}\n> **ID** : \`${guild.id}\`\n> **Creation of the server** : <t:${Math.floor(guild.createdTimestamp/1000)}:F> (<t:${Math.floor(guild.createdTimestamp/1000)}:R>)\n> **Number of members** : ${guild.memberCount} members`
                }, {
                    name: "Vue d'ensemble",
                    value: `> **Number of channels** : ${guild.channels.cache.size} salons\n> **Number of emojis** : ${guild.emojis.cache.size}\n> **Number of boost** : ${guild.premiumSubscriptionCount} boost\n> **Roles [${guild.roles.cache.size}]**`
                })
            ]
        });
    } catch(err){
        interaction.reply(`\`\`\`js\n${err}\`\`\``)
    }
        }
};
