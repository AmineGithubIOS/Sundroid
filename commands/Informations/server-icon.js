const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "server-icon",
    description: "Show server icon",
    category: "Info",
    execute: async (client, interaction, args) => {
        if (!interaction.guild.icon) {
            return interaction.reply({ content: `**This server does not have an icon.**`, ephemeral: true });
        }

        const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Download").setEmoji("📥").setStyle(5).setURL(interaction.guild.iconURL({ size: 1024})));

        interaction.reply({ embeds: [new EmbedBuilder().setColor(client.color).setAuthor({ name: `Here is the server icon`, iconURL: interaction.guild.iconURL() }).setImage(interaction.guild.iconURL({size: 1024}))], components: [btn] });
    }
};
