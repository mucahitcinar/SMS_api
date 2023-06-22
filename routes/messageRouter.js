const express=require("express")
const messageControllers=require("../functions/messageControlller")
const router=express.Router()




router
      .route("/")
      .get(messageControllers.getAllMessages)
      .post(messageControllers.createMessage)

router
     .route("/:id")
     .delete(messageControllers.deleteMessage)

module.exports=router

      
     