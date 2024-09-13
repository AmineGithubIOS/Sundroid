const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "Display all bot commands",
  category: "Info",
  execute: async (client, interaction) => {
    try {
      // Utilisation de deferReply pour éviter l'expiration
      await interaction.deferReply();

      const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("menu")
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setValue("why")
              .setEmoji("❓")
              .setLabel("Why add me to your server ?"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("🛡️")
              .setValue("modo")
              .setLabel("Moderation commands"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("🔩")
              .setValue("utils")
              .setLabel("Utilities Commands"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("ℹ️")
              .setValue("info")
              .setLabel("Information Commands"),
            new StringSelectMenuOptionBuilder()
              .setEmoji("📁")
              .setValue("eco")
              .setLabel("Management Commands")
          )
      );

      const back = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Back")
          .setStyle(1)
          .setCustomId("back")
          .setEmoji("↩️")
      );

      const btn = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Support")
          .setEmoji("✨")
          .setCustomId("join")
          .setStyle(1),
        new ButtonBuilder()
          .setEmoji("🤖")
          .setLabel("Invite")
          .setURL(client.invite)
          .setStyle(5),
        new ButtonBuilder()
          .setLabel("Find a command")
          .setEmoji("🔍")
          .setStyle(3)
          .setCustomId("search")
      );

      const commandsByCategory = {};
      const slashCommands = client.slashCommands;

      slashCommands.forEach(cmd => {
        if (!commandsByCategory[cmd.category]) {
          commandsByCategory[cmd.category] = [];
        }
        commandsByCategory[cmd.category].push(cmd);
      });

      const moderationCommands = commandsByCategory["Mod"];
      const utilsCommands = commandsByCategory["Utils"];
      const ecoCmds = commandsByCategory["gestion"];
      const embed = new EmbedBuilder()
        .setTitle("List of bot commands")
        .setURL(client.invite)
        .setDescription(
          `**You want to have a versatile bot with unique commands and an intuitive interface, \`${client.user.username}\` is for you. Also, already \`${client.guilds.cache.size}\` servers trust us.**`
        )
        .setImage(client.image)
        .setColor(client.color)
        .setAuthor({
          name: `Full list of bot commands`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      // Envoi du message initial
      const msg = await interaction.editReply({
        embeds: [embed],
        components: [menu, btn],
      });

      // Création du collecteur
      const collector = await msg.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 100000,
      });

      collector.on("collect", async i => {
        try {
          if (i.customId === "menu") {
            if (i.values[0] === "modo")
              return i.update({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `${utilsCommands
                        .map(
                          x =>
                            `**</${x.name}:1>\n> Description : ${x.description}**`
                        )
                        .join("\n\n")}`
                    )
                    .setAuthor({
                      name: `List of moderation commands`,
                      iconURL: client.user.displayAvatarURL(),
                    })
                    .setColor(client.color),
                ],
                components: [back],
              });
            if (i.values[0] === "eco")
              return i.update({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `${ecoCmds
                        .map(
                          x =>
                            `**</${x.name}:1>\n> Description : ${x.description}**`
                        )
                        .join("\n\n")}`
                    )
                    .setAuthor({
                      name: `List of management commands`,
                      iconURL: client.user.displayAvatarURL(),
                    })
                    .setColor(client.color),
                ],
                components: [back],
              });
            // Autres options...
          }

          if (i.customId === "join") {
            i.reply({ content: `${client.invite}`, ephemeral: true });
          }

          if (i.customId === "back") {
            i.update({ embeds: [embed], components: [menu, btn] });
          }

          if (i.customId === "search") {
            const modal = new ModalBuilder()
              .setTitle("Order search")
              .setCustomId("modal");
            const cmdSearch = new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("cmdTo")
                .setLabel("Please enter the command name.")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Enter the command name")
            );
            modal.addComponents(cmdSearch);
            await i.showModal(modal);
          }
        } catch (error) {
          console.error("Error handling interaction:", error);
          i.reply({
            content: "There was an error processing your request.",
            ephemeral: true,
          });
        }
      });

      collector.on("end", async () => {
        try {
          btn.components.forEach(x => x.setDisabled(true));
          menu.components.forEach(x => x.setDisabled(true));
          await msg.edit({ components: [menu, btn] });
        } catch (error) {
          console.error("Error disabling components after collector ends:", error);
        }
      });
    } catch (error) {
      console.error("Error executing command:", error);
      interaction.followUp({
        content: "There was an error while executing this command.",
        ephemeral: true,
      });
    }
  },
};
