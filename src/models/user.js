const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        minLength : 1,
        maxLength : 30,
        required : true,
        index: true,
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
            if(!validator.isEmail(value)){
                throw new Error("Enter a correct E-Mail")
            }
        }
    },
    password:{
        type:String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your Password is too weak")
            }
        }
    },
    age:{
        type:Number,
        min : 18
    },
    gender:{
        type:String,
        enum : {
            values: ["male","female"],
            message: `{VALUE} is not a gender`
        }
    },
    photoUrl:{
        type: String,
        default: "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg",
        validate(value){
            if(!validator.isURL(value)){
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

userSchema.index({firstName:1, lastName:1});

userSchema.methods.createToken = async function(){
    const user = this;

    const token = await jwt.sign({_id:user._id},"DEV@tinder123",{expiresIn:'7d'});
    return token;
}

userSchema.methods.passwordCheck = async function(passwordEntered) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordEntered, user.password)
    return isPasswordValid;
}

// const User = mongoose.model("User",userSchema);
module.exports = mongoose.model("User",userSchema);