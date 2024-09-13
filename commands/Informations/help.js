const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Display an interactive help menu with all bot commands",
  category: "Info",
  execute: async (client, interaction) => {
    try {
      await interaction.deferReply();

      // Boutons de catégories de commandes
      const categoryRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("category_moderation")
          .setLabel("Moderation")
          .setStyle(1) // Primary button
          .setEmoji("🛡️"),
        new ButtonBuilder()
          .setCustomId("category_utilities")
          .setLabel("Utilities")
          .setStyle(1)
          .setEmoji("🔧"),
        new ButtonBuilder()
          .setCustomId("category_information")
          .setLabel("Information")
          .setStyle(1)
          .setEmoji("ℹ️"),
        new ButtonBuilder()
          .setCustomId("category_fun")
          .setLabel("Fun")
          .setStyle(1)
          .setEmoji("🎉")
      );

      const mainEmbed = new EmbedBuilder()
        .setTitle("SunDroid Help Menu")
        .setDescription("Select a category to view the available commands.")
        .setColor("#00FFAB") // Couleur moderne
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: "SunDroid - Your versatile Discord bot" })
        .setTimestamp();

      const helpMessage = await interaction.editReply({
        embeds: [mainEmbed],
        components: [categoryRow],
      });

      // Collecteur pour gérer les interactions
      const collector = helpMessage.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 60000, // 1 minute
      });

      collector.on("collect", async i => {
        if (i.customId.startsWith("category_")) {
          let categoryName;
          let categoryDescription;

          // Définition du contenu en fonction de la catégorie choisie
          if (i.customId === "category_moderation") {
            categoryName = "Moderation Commands";
            categoryDescription = client.slashCommands
              .filter(cmd => cmd.category === "Mod")
              .map(cmd => `**/${cmd.name}** - ${cmd.description}`)
              .join("\n");
          } else if (i.customId === "category_utilities") {
            categoryName = "Utilities Commands";
            categoryDescription = client.slashCommands
              .filter(cmd => cmd.category === "Utils")
              .map(cmd => `**/${cmd.name}** - ${cmd.description}`)
              .join("\n");
          } else if (i.customId === "category_information") {
            categoryName = "Information Commands";
            categoryDescription = client.slashCommands
              .filter(cmd => cmd.category === "Info")
              .map(cmd => `**/${cmd.name}** - ${cmd.description}`)
              .join("\n");
          } else if (i.customId === "category_fun") {
            categoryName = "Fun Commands";
            categoryDescription = client.slashCommands
              .filter(cmd => cmd.category === "Fun")
              .map(cmd => `**/${cmd.name}** - ${cmd.description}`)
              .join("\n");
          }

          // Affichage de l'embed pour la catégorie choisie
          const categoryEmbed = new EmbedBuilder()
            .setTitle(categoryName)
            .setDescription(categoryDescription)
            .setColor("#FF6347") // Couleur pour cette section
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

          await i.update({ embeds: [categoryEmbed], components: [categoryRow] });
        }
      });

      collector.on("end", async () => {
        try {
          categoryRow.components.forEach(button => button.setDisabled(true));
          await helpMessage.edit({ components: [categoryRow] });
        } catch (error) {
          console.error("Error disabling buttons after collector ends:", error);
        }
      });
    } catch (error) {
      console.error("Error executing command:", error);
      interaction.followUp({
        content: "An error occurred while executing the help command.",
        ephemeral: true,
      });
    }
  },
};
