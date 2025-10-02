const validator = require('validator')
const isValidData =(req)=>{
    const {firstName, lastName, emailID, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Insufficient Details");
    }
    else if(!validator.isEmail(emailID)){
        throw new Error("Invalid Email ID");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is too weak");
    }
}

module.exports = {isValidData}