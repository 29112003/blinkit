const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL).then(function(){
    console.log("connected to mongodb")
})

module.exports = mongoose.connection;