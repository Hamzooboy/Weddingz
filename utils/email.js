const nodemailer = require('nodemailer');

// module.exports = class Email {
//     constructor(user, url) {
//         this.to = user.email;
//         this.firstName = user.name.split(' ')[0];
//         this.url = url;
//         this.from = 'Hamza Awan <hello@hamza.io>'
//     }
//     newTransport() {
//         return nodemailer.createTransport({
//             host: 'smtp.mailtrap.io',
//             port: 2525,
//             auth: {
//                 user: '38f0b3eb98e84c',
//                 pass: '6c028ec1273b7d'
//             },
//             // tls: {
//             //     rejectUnauthorized: false
//             // }
//         })
//     }
//     async send(template, subject) {
//         const mailOptions = {
//             from: this.from,
//             to: this.to,
//             subject,
//             text
//         };
//         //Create Transport and send Email
//         await this.newTransport().sendMail(mailOptions)
//     }
//     async sendWelcome() {
//         await this.send('Welcome', 'Welcome to Weddingz Family')
//     }
// }

//Creating Transporter
const sendEmail = async function(options) {
    const transporter = nodemailer.createTransport({
            // host: 'smtp.mailtrap.io',
            // port: 2525,
            service: 'gmail',
            secure: false,
            auth: {
                user: 'weddingzofficial@gmail.com',
                pass: 'Weddingz@123'
            },
            tls: {
                rejectUnauthorized: false
            }
        })
        //Define the email options
    const mailOptions = {
        from: 'weddingzofficial@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    console.log(options.email)
    console.log(options.subject)
        //Send mail
    await transporter.sendMail(mailOptions)

}

module.exports = sendEmail;