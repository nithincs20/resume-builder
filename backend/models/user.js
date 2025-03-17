const mongoose  =require("mongoose")
const userSchema=mongoose.Schema(
    {
        username:{type:String,required:true},
        password:{type:String,required:true},
        usertype:{type:String,required:true}
        

    })

let userModel=mongoose.model("user",userSchema)
module.exports=userModel