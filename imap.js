const Imap = require('node-imap');
const inspect = require('util').inspect;


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

      msg.once('end', function() {
        const truncatedBody = emailBody.substring(29); // Remove the first 29 characters
        const cleanedBody = truncatedBody.replace(/[\n\r]/g, ''); // Remove newline and carriage return characters
        emailBodies.push(cleanedBody); // Add cleaned body to the array
      });
    });

    fetch.once('end', function() {
      imap.end();
      console.log('Email Bodies:');
      console.log(emailBodies);
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.connect();
