
let Message=require("C:/Users/mücahit/Documents/GitHub/SMS_api/models/messageModel")




exports.createMessage=async (req,res,next)=>
{


    try
    {

        
        let SMS=await Message.create(req.body)

        res.status(200).json(
         {
             status:"success",
             data:
             {
                 SMS
             }
         }
        )
    }
    catch(err)
    {
        next(err)
    }
   
}


exports.getAllMessages=async(req,res,next)=>
{
    try
    {
       let all=await Message.find()

       res.status(200).json(
        {
            status:"success",
            data:
            {
                all
            }
        }
       )
    }
    catch(err)
    {
        next(err)
    }
}

exports.deleteMessage=async (req,res,next)=>
{
    await Message.findByIdAndDelete(req.params.id)

    res.status(200).json
    (
        {
            status:"success",
            message:"message has been deleted successfully"
        }
    )
}
