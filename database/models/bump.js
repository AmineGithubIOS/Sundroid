const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    guildId: String,
    description: String,
    channelId: String,
    lastUser: String,
    lastChannel: String,
    lastTime: String,
    bump: {
        type: Number,
        default: 0
    },
    link: String,
    remind: {
        type: Boolean,
        default: false
    }
})

const model = mongoose.model("bump", schema)

module.exports = model