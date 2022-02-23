const nodemailer = require('nodemailer');

//Creating Transporter
const sendEmail = async function(options) {
    const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '38f0b3eb98e84c',
                pass: '6c028ec1273b7d'
            },
            // tls: {
            //     rejectUnauthorized: false
            // }
        })
        //Define the email options
    const mailOptions = {
            from: 'Hamza Awan <hello@hamza.io>',
            to: options.email,
            subject: options.subject,
            text: options.message
        }
        //Send mail
    await transporter.sendMail(mailOptions)

}

module.exports = sendEmail;