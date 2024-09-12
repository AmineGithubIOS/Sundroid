const { Client, GatewayIntentBits, Partials, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const colors = require("colors")
const config = require('./config.json');
const ms = require("ms")
const bump = require("./database/models/bump.js")
const client = new Client({
    intents: 3276799,
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ]
});

const CaptchaManager  = require("./module-captcha/captcha.js") 
const Captcha = new CaptchaManager(client)

module.exports = client;
client.commands = new Collection();
client.slashCommands = new Collection();

client.on('ready', async () => {
 require("./handler")(client);
 require("./database/connect.js")
    const readyEvent = require('./events/client/ready.js')
    await readyEvent.execute(client)
})

client.login(config.token)

client.color = config.color
client.invite = config.invite
client.image = config.image