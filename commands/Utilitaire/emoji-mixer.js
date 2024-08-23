const superagent = require("superagent")
const onlyEmoji = require("emoji-aware").onlyEmoji;
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "emoji-mixer",
    description: "Allows you to mix emojis",
    category: "Utils",
    options: [{
        name: "emoji",
        description: "The two emoji to mix",
        type: 3,
        required: true
    }],
    execute: async(client, interaction) => {
        
        const emoji = interaction.options.getString("emoji")
        const input = onlyEmoji(emoji)
        const response = `**One of these emojis: \`${emoji}\` is not supported. Please try again with others.**`
        const output = await superagent.get(`https://tenor.googleapis.com/v2/featured`).query({
            key: "AIzaSyC8Gaeyh_GU_CiBzsFz_lpt1mV-KOHF_50",
            contentfilter: "high",
            media_filter: "png_transparent",
            component: "proactive",
            collection: "emoji_kitchen_v5",
            q: input.join("_")
        }).catch(err => {})
        if(!output){
            return await interaction.reply({ content: response, ephemeral: true })
        } else if(!output.body.results[0]){
            return await interaction.reply({ content: response, ephemeral: true })
        } else if(emoji.startsWith("<") || emoji.endsWith(">")){
            return await interaction.reply({ content: response, ephemeral: true })
        }
        
await interaction.reply({ embeds: [new EmbedBuilder().setImage(output.body.results[0].url).setColor(client.color).setURL(output.body.results[0].url).setTitle("Emoji mixer").setDescription(`**Here is the combination between \`${emoji}\`**`).setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL()})], ephemeral: false })
            
    }
}