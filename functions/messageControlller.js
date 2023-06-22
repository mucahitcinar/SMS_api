
// let Message=require("../models/messageModel")
// const Imap = require('node-imap');
// const inspect = require('util').inspect;




// exports.createMessage=async (req,res,next)=>
// {


//     try
//     {
//       const Imap = require('node-imap');
//       const inspect = require('util').inspect;
      
      
//       const imapConfig = {
//         user: 'elgatogavz@hotmail.com',
//         password: 'gavzgavz3',
//         host: 'outlook.office365.com',
//         port: 993,
//         tls: true,
//       };
      
//       const imap = new Imap(imapConfig);
//       const emailBodies = []; // Array to store email bodies
      
//       function openInbox(cb) {
//         imap.openBox('INBOX', true, cb);
//       }
      
//       imap.once('ready', function() {
//         openInbox(function(err, box) {
//           if (err) throw err;
//           const fetchOptions = {
//             bodies: ['HEADER.FIELDS (FROM TO SUBJECT)', 'TEXT'],
//             struct: true,
//           };
//           const fetch = imap.fetch('1:*', fetchOptions); // Retrieve all emails from the mailbox
      
//           fetch.on('message', function(msg, seqno) {
//             let emailBody = '';
      
//             msg.on('body', function(stream, info) {
//               const isTextPlain = info.which === 'TEXT';
//               let body = '';
      
//               stream.on('data', function(chunk) {
//                 if (isTextPlain) {
//                   body += chunk.toString('utf8');
//                 }
//               });
      
//               stream.once('end', function() {
//                 if (isTextPlain) {
//                   emailBody += body;
//                 }
//               });
//             });
      
//             msg.once('end', function() {
//               const truncatedBody = emailBody.substring(29); // Remove the first 29 characters
//               const cleanedBody = truncatedBody.replace(/[\n\r]/g, ''); // Remove newline and carriage return characters
//               emailBodies.push(cleanedBody); // Add cleaned body to the array
//             });
//           });
      
//           fetch.once('end', async()=>{
//             imap.end();
            
//            let i=0
//            while(i<emailBodies.length)
//            {
//              const SMS=await Message.create({context:`https://www.google.com/maps?q=${emailBodies[i]}`})
//              i++
//            }
           
//            res.status(200).json(
//              {
//                status:"successfull"
//              }
//            )
//           });
//         });
//       });
      
//       imap.once('error', function(err) {
//         console.log(err);
//       });
      
//       imap.connect();
          
         
               
//     }
//     catch(err)
//     {
//         next(err)
//     }
   
// }


// exports.getAllMessages=async(req,res,next)=>
// {
//     try
//     {
//        let all=await Message.find()

//        res.status(200).json(
//         {
//             status:"success",
//             all
          
//         }
//        )
//     }
//     catch(err)
//     {
//         next(err)
//     }
// }

// exports.deleteMessage=async (req,res,next)=>
// {
//     await Message.findByIdAndDelete(req.params.id)

//     res.status(200).json
//     (
//         {
//             status:"success",
//             message:"message has been deleted successfully"
//         }
//     )
// }



let Message = require("../models/messageModel");
const Imap = require('node-imap');
const inspect = require('util').inspect;

exports.createMessage = async (req, res, next) => {
  try {
    const imapConfig = {
      user: 'elgatogavz@hotmail.com',
      password: 'gavzgavz3',
      host: 'outlook.office365.com',
      port: 993,
      tls: true,
    };

    const imap = new Imap(imapConfig);
    const emailBodies = []; // Array to store email bodies

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function() {
      openInbox(function(err, box) {
        if (err) throw err;
        const fetchOptions = {
          bodies: ['HEADER.FIELDS (FROM TO SUBJECT)', 'TEXT'],
          struct: true,
          envelope: true, // Include envelope to retrieve date information
        };
        const fetch = imap.fetch('1:*', fetchOptions); // Retrieve all emails from the mailbox

        fetch.on('message', function(msg, seqno) {
          let emailBody = '';

          msg.on('body', function(stream, info) {
            const isTextPlain = info.which === 'TEXT';
            let body = '';

            stream.on('data', function(chunk) {
              if (isTextPlain) {
                body += chunk.toString('utf8');
              }
            });

            stream.once('end', function() {
              if (isTextPlain) {
                emailBody += body;
              }
            });
          });

          msg.once('attributes', function(attrs) {
            // Retrieve the date from the email's attributes
            const emailDate = attrs.envelope.date;
            const truncatedBody = emailBody.substring(29); // Remove the first 29 characters
            const cleanedBody = truncatedBody.replace(/[\n\r]/g, ''); // Remove newline and carriage return characters

            emailBodies.push({
              body: cleanedBody,
              date: emailDate, // Save the email's date to the 'date' field
            });
          });
        });

        fetch.once('end', async () => {
          imap.end();

          let i = 0;
          while (i < emailBodies.length) {
            const { body, date } = emailBodies[i];
            const SMS = await Message.create({
              context: `https://www.google.com/maps?q=${body}`,
              timestamp: date, // Save the email's date to the 'timestamp' field
            });
            i++;
          }

          res.status(200).json({
            status: "successfull"
          });
        });
      });
    });

    imap.once('error', function(err) {
      console.log(err);
    });

    imap.connect();
  } catch (err) {
    next(err);
  }
};

exports.getAllMessages = async (req, res, next) => {
  try {
    let all = await Message.find();

    res.status(200).json({
      status: "success",
      all
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMessage = async (req, res, next) => {
  await Message.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "message has been deleted successfully"
  });
};

