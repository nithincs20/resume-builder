const mongoose  =require("mongoose")
const resumeSchema=mongoose.Schema(
    {
       name:{ type: String ,required:true},
       email: { type: String ,required:true}

    })

let resumeModel=mongoose.model("resume",resumeSchema)
module.exports=resumeModel