const ms = require("ms")
const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder, Collection } = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()
const captcha = require("../../database/models/captcha.js");

module.exports = {
    name: "guildMemberAdd",
    execute: async(member, client) => {
        const data = await captcha.findOne({ guildId: member.guild.id });
    
    if (!data) return;
    
    const channel = member.guild.channels.cache.get(data.channelId);
    if (!channel) return;

    let role = member.guild.roles.cache.get(data.role);
    if (data.role && !role) {
            role = await member.guild.roles.create({
      name: "SunDroid - Captcha",
      color: "#ffffff",
                });
            data.role = role.id;
            await data.save();
    }
    
    try {
        await member.roles.add(role.id);
    
    const captchaOptions = {
        upper: data.sentence.includes("upper"),
        lower: data.sentence.includes("low"),
        numbers: data.sentence.includes("number"),
        symbols: data.sentence.includes("symbol"),
        time: data.time,
        length: data.length,
    };

    Captcha.submit(member, channel, captchaOptions);
        } catch(e){
            console.log(e)
        }

    }
}