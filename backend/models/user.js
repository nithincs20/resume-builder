const mongoose  =require("mongoose");
const userSchema=mongoose.Schema(
    {
        name: { type: String, required: true }, 
        email:{type:String,required:true}, 
        resumeData: { type: Object }

    });

let userModel=mongoose.model("user",userSchema);
module.exports=userModel;
