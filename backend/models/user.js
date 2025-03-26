const mongoose  =require("mongoose");
const userSchema=mongoose.Schema(
    {
        name: String,
        email: String,
        resumeData: {
            text: String, // Store extracted text inside an object
        },

    });

let userModel=mongoose.model("user",userSchema);
module.exports=userModel;
