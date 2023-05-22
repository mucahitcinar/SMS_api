const mongoose=require("mongoose")

let mesSchema= new mongoose.Schema(
    {
        context:
        {
            type:String
        }
    }
)



let Message=new mongoose.model("Message",mesSchema)

module.exports=Message