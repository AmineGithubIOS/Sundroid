const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "server-banner",
    description: "Show server banner",
    category: "Info",
    execute: async (client, interaction, args) => {
        if (!interaction.guild.banner) {
            return interaction.reply({ content: `**This server does not have any banners.**`, ephemeral: true });
        }

        const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Download").setEmoji("📥").setStyle(5).setURL(interaction.guild.bannerURL({ size: 2048 })));

        interaction.reply({ embeds: [new EmbedBuilder().setColor(client.color).setAuthor({ name: `Here is the server banner`, iconURL: interaction.guild.iconURL({ size: 2048 }) }).setImage(interaction.guild.bannerURL())], components: [btn] });
    }
};
