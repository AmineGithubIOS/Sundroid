const mongoose = require("mongoose")
const colors = require("colors")
const config = require("../config.json")

mongoose.connect(config.mongoose)

mongoose.set('strictQuery', true);
const db = mongoose.connection
db.once('open', () => {
   console.log(`[DATABASE] Connexion établie`.bold.red);

})