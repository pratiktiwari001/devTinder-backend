const mongoose = require('mongoose');
const validator = require('validator');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isURL } = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        minLength : 1,
        maxLength : 30,
        required : true,
    },
    lastName:{
        type:String,
        default: "N/A"
    },
    emailID:{
        type:String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true,
        validate(value){
            if(!isEmail(value)){
                throw new Error("Enter a correct E-Mail")
            }
        }
    },
    password:{
        type:String,
        required : true
    },
    age:{
        type:Number,
        min : 18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender Data is not Valid");
            }}
    },
    photoUrl:{
        type: String,
        default: "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg",
        validate(value){
            if(!isURL(value)){
                throw new Error("Please enter the correct URL")
            }
        }
    },
    skills:{
        type: [String]
    }
}, {
    timestamps: true
});

// const User = mongoose.model("User",userSchema);

module.exports = mongoose.model("User",userSchema);