const mongoose = require("mongoose")
const colors = require("colors")
const config = require("../config.json")

mongoose.connect(config.mongoose)

const db = mongoose.connection
db.once('open', () => {
   console.log(`[DATABASE] Connexion établie`.bold.red);

})