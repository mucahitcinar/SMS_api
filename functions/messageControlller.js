
let Message=require("C:/Users/mücahit/Documents/GitHub/SMS_api/models/messageModel")
const Imap = require('node-imap');
const inspect = require('util').inspect;




exports.createMessage=async (req,res,next)=>
{


    try
    {

        
        const imapConfig = {
            user: 'elgatogavz@hotmail.com',
            password: 'gavzgavz3',
            host: 'outlook.office365.com',
            port: 993,
            tls: true,
          };
          
          
          const imap = new Imap(imapConfig);
          
          function openInbox(cb) {
            imap.openBox('INBOX', true, cb);
          }
          
          imap.once('ready', function() {
            openInbox(function(err, box) {
              if (err) throw err;
              imap.search(['UNSEEN'], function(err, results) {
                if (err) throw err;
                const lastEmailUID = results[results.length - 1]; // Retrieve the UID of the last unseen email
                const fetchOptions = {
                  bodies: ['TEXT'],
                };
                const fetch = imap.fetch([lastEmailUID], fetchOptions);
          
                fetch.on('message', function(msg, seqno) {
                  let emailBody = '';
          
                  msg.on('body', function(stream, info) {
                    stream.on('data', function(chunk) {
                      emailBody += chunk.toString('utf8');
                    });
                  });
          
                  msg.once('end',async  function() {
                    const truncatedBody = emailBody.substring(29); // Delete the first 29 characters
                    console.log(truncatedBody)
                    let SMS=await Message.create({context:`https://www.google.com/maps?q=${truncatedBody}`})
                    res.status(200).json({
                        status:"success",
                        data:
                        {
                           SMS
                        }
                    })
                    
                  });
                });
          
                fetch.once('end', function() {
                  imap.end();
                });
              });
            });
          });
          
          imap.once('error', function(err) {
            console.log(err);
          });
          
          imap.connect();
        
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
