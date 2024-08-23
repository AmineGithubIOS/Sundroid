const mongoose = require("mongoose")
const colors = require("colors")

mongoose.connect("mongodb+srv://merdepaypal:NBYJuxzlmBO5b5ca@database.6onav8x.mongodb.net/?retryWrites=true&w=majority", {
   useNewUrlParser: true,
   useUnifiedTopology: true
})

mongoose.set("strictQuery", true)
const db = mongoose.connection
db.once('open', () => {
   console.log(`[DATABASE] Connexion établie`.bold.red);

})