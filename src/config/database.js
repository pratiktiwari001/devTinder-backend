const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://tiwaripratik2005:1fRM03HTzy3XZ0Bv@namastenode.ozqo4uo.mongodb.net/devTinder"
    );
}

module.exports = connectDB