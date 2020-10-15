const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    }
});



exports.sendWelcomeEmail = (to, subject, text) => {
    transporter.sendMail({ from: process.env.EMAIL_FROM, to: to, subject: subject, text: text }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

exports.sendAccountTerminationEmail = (to, subject, text) => {
    transporter.sendMail({ from: process.env.EMAIL_FROM, to: to, subject: subject, text: text }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};