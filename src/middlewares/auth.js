const adminAuth = (req,res,next)=>{
    const token = "xyz";
    isAdminAuthorized = "xyz" === token;
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Access!!");
    }
    else{
        next();
    }
}

const userAuth = (req,res,next)=>{
    const token = "abc";
    isUserAuthorized = "abc"===token;
    if(!isUserAuthorized){
        res.status(401).send("Unauthorized Access!!")
    } else {
        next();
    }
}

module.exports = {adminAuth,userAuth};