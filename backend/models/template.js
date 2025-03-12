const mongoose  =require("mongoose")
const templateSchema=mongoose.Schema(
    {
        img:{ type: String ,required:true},
        title:{type:String,required:true},

    })

let templateModel=mongoose.model("templates",templateSchema)
module.exports=templateModel
