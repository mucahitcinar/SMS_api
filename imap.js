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
        bodies: ['HEADER.FIELDS (FROM TO SUBJECT)', 'TEXT'],
        struct: true,
      };
      const fetch = imap.fetch([lastEmailUID], fetchOptions);

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
          console.log('Last email body:');
          console.log(emailBody.trim());
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