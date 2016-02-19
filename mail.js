var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'mail.ernestoaraiza.com',
    port: 587,
    auth: {
        user: 'yo@ernestoaraiza.com',
        pass: 'xxx'
    },
    tls: {
        rejectUnauthorized:false
    }
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

var mailOptions = {};

exports.mailOptions = mailOptions;

// send mail with defined transport object
exports.send = function(mailOptions){
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });};