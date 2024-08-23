const { EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const QuickChart = require('quickchart-js');

module.exports = {
      name: 'server-membercount',
      description:'Displays the number of members on the server.',
      category: "Info",
    execute: async(client, interaction) => { 
        interaction.deferReply()
        const guild = interaction.guild;
        const totalMembers = guild.memberCount;
        const botMembers = guild.members.cache.filter(member => member.user.bot).size;
        const humanMembers = totalMembers - botMembers;
        const last24Hours = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 24 * 60 * 60 * 1000).size;
        const last7Days = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 7 * 24 * 60 * 60 * 1000).size;
       


        const chart = new QuickChart();
        chart
            .setConfig({
                type: 'bar',
                data: {
                    labels: ['Total', 'Members', 'Bots', '24h', '7 days'],
                    datasets: [{
                        label: 'Member Count',
                        data: [totalMembers, humanMembers, botMembers, last24Hours, last7Days],
                        backgroundColor: ['#36a2eb', '#ffce56', '#ff6384', '#cc65fe', '#66ff99']
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Généré par ${client.user.tag} sur le serveur ${guild.name}`
                        }
                    }
                },



            
            })

            .setWidth(500)
            .setHeight(300)
            .setBackgroundColor('#151515');
           


        const chartUrl = await chart.getShortUrl();

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL()})
            .addFields({ name: `Server members stats`, value: `> **Total : \`${totalMembers}\` members\n> Members : \`${humanMembers}\` members\n> Bots : \`${botMembers}\` bots\n> Last 24h : \`${last24Hours}\` joins\n> Last 7 days : \`${last7Days}\` joins**`})
            .setImage(chartUrl);

        await interaction.editReply({ embeds: [embed] });
    },
};