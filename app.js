require('dotenv').config()
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function main({name, email, phone, comment}){
    const { FROM_MAIL, FROM_HOST, FROM_PORT, FROM_PASSWORD, TO_MAIL } = process.env
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: FROM_HOST,
        port: FROM_PORT,
        auth: {
            user: FROM_MAIL,
            pass: FROM_PASSWORD
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'tocontact@pfactory.ru', // sender address
        to: TO_MAIL, // list of receivers
        subject: "Заявка ✔", // Subject line
        text: `Данные: ${name}(${phone}), email: ${email}, комментарий: ${comment}`, // plain text body
    });

    console.log("Message to sent 2: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

app.post('/send_mail', (req, res) => {
    console.log('Body = ', req.body);
    main(req.body);
    res.send('ok')

})

app.listen(4000, () => {
    const { FROM_MAIL, FROM_HOST, FROM_PORT, FROM_PASSWORD, TO_MAIL } = process.env
    console.log('Start server pfactory_mail_node...', FROM_MAIL, FROM_HOST, FROM_PORT, FROM_PASSWORD, TO_MAIL)
});