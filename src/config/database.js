const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect(
        "mongoDB_connection_string"
    );
}

module.exports = connectDB