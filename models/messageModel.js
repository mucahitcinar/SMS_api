// const mongoose=require("mongoose")

// let mesSchema= new mongoose.Schema(
//     {
//         context:
//         {
//             type:String
//         },

//         timestamp:
//         {

//         }
//     }
// )



// let Message=new mongoose.model("Message",mesSchema)

// module.exports=Message



const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  context: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date, // Update the data type as per your database setup
    required: true,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
