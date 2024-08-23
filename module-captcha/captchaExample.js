const { Client } = require("discord.js");
const client = new Client({
    intents: [3276799]
});



client.once("ready", async () => {
    console.log("Prêt " + client.user.id)
    // Tester le captcha:
    // client.emit("guildMemberAdd", (client.guilds.cache.get("1135515317586628669").members.cache.get("382936822860218370")))
});

client.on("guildMemberAdd", async (member) => {
    const channel = client.guilds.cache.get("1135515317586628669").channels.cache.get("1139246313846886491")
  Captcha.submit(member, channel, { upper: true, lower: true, numbers: true, symbols: true, time: 60000, length: 6 })
});

client.on("captchaSuccess", (member, captchaChannel) => {
    // Captcha réussi
});


client.on("captchaInvalid", (member, captchaChannel, invalidCode, validCode) => {
    // Captcha invalide
    // Tu peux utiliser les codes pour faire un log du style "Code saisi invalidCode au lieu de validCode"
});

client.on("error",async (err)=>{})

client.login("");
