const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.MY_EMAIL,
        subject: 'Welcome to the app!',
        text: `Welcome, ${name}! Hope you enjoy the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.MY_EMAIL,
        subject: 'Cancellation confirmation',
        text: `Hello, ${name}! This is a confirmation that you have successfully unsubscribed from our mailing list.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}