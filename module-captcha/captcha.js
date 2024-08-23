
module.exports = class CaptchaManager {
    constructor(client) {
        this.client = client;
    }

    async submit(member, channel, options) {
        const { EmbedBuilder } = require("discord.js")
        if(!options.length || isNaN(options.length)) throw new Error("Taille invalide")
        if(!options.upper && !options.lower && !options.numbers && !options.symbols) throw new Error("Au moins d'une des options de captcha doit être valide !")

        let code = generateRandomString(options)

        let msg = await channel.send({ content: `<@${member.user.id}>`, embeds: [new EmbedBuilder().setDescription(`**In order to prove that you are human, please solve this captcha below.**`).setImage('attachment://captcha.png').setColor(this.client.color)],
            files: [await generateCaptcha(code).catch(err => console.log(err))]
        });

        let collector = await channel.createMessageCollector({ filter: m => m.author.id == member.user.id, max: 1, time: options.time || 30000})


        collector.on('end', collected => {
            msg.delete().catch(err => {});
            collected.first()?.delete().catch(err => {})

            if(collected.first()?.content == code) {
                this.client.emit("captchaSuccess", member, channel)
            } else {
                this.client.emit("captchaInvalid", member, channel, collected.first()?.content == code, code )
            }
        });
    }
}


const { createCanvas } = require('canvas');
const { AttachmentBuilder } = require('discord.js');

function generateRandomString(options) {
    let characters = '';

    if (options.upper) {
        characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (options.lower) {
        characters += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (options.numbers) {
        characters += '0123456789';
    }
    if (options.symbols) {
        characters += '!@#$%^&*()-_=+[]{}|;:,.<>?';
    }

    let result = '';
    for (let i = 0; i < options.length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const fs = require('fs');

async function generateCaptcha(captchaText) {
    const canvas = createCanvas(500, 100);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#fad046'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
        
    ctx.shadowColor = '#FFFFFF'; 
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    
    const textWidth = ctx.measureText(captchaText).width;
    
    const centerX = (canvas.width - textWidth) / 2;

    const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Poppins'];

    for (let i = 0; i < captchaText.length; i++) {
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)];

        ctx.font = `bold 40px ${randomFont}`;

        const charX = centerX + (i * (textWidth / captchaText.length));

        ctx.fillText(captchaText[i], charX, 70);
    }
    
    const buffer = canvas.toBuffer();
    await fs.promises.writeFile('./captcha.png', buffer);

    return new AttachmentBuilder("./captcha.png", { name: "captcha.png"})
}
