
var express = require("express");
var bodyParser = require("body-parser");
let messagesRouter=require ("./routes/messageRouter")
var cors = require('cors')
var app = express();

app.use(bodyParser.json());
app.use(cors())
app.use("/SMSapi/v1/messages",messagesRouter)

module.exports = app