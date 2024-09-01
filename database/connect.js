const mongoose = require("mongoose")
const colors = require("colors")

mongoose.connect("mongodb+srv://sundroid:fabrice125@cluster0.uls9q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
   useNewUrlParser: true,
   useUnifiedTopology: true
})

mongoose.set("strictQuery", false);
const db = mongoose.connection
db.once('open', () => {
   console.log(`[DATABASE] Connexion établie`.bold.red);

})