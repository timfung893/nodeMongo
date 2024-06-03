const nodeMailer = require('nodemailer');

const sendEmail = async (option) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    })

    const emailOptions = {
        from: 'NodeMongo support<support@nodemongo.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions);
}

module.exports = sendEmail