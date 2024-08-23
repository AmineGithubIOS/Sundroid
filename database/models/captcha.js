const ms = require("ms")
const m = require("mongoose")
const time = ms("1m")

const s = new m.Schema({
    guildId: String,
    channelId: String,
    time: {
        type: String,
        default: `${time}`
        },
    sentence: {
        type: [String],
        default: ["upper", "number"]
    },
    length: {
        type: Number,
        default: 8
    },
    roles: {
        type: [String],
        default: []
    },
    fails: {
        type: String,
        default: "kick"
    },
    role: {
        type: String
    }
})

const model = m.model("captcha", s)

module.exports = model;