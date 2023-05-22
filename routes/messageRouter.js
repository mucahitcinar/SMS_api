const express=require("express")
const messageControllers=require("C:/Users/mücahit/Documents/GitHub/SMS_api/functions/messageControlller")
const router=express.Router()




router
      .route("/")
      .get(messageControllers.getAllMessages)
      .post(messageControllers.createMessage)

router
     .route("/:id")
     .delete(messageControllers.deleteMessage)

module.exports=router

      
     