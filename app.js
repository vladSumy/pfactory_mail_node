const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function main({name, email, phone, comment}){
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 587,
        auth: {
            user: 'tocontact@pfactory.ru',
            pass: 'Deal223423'
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'tocontact@pfactory.ru', // sender address
        to: 'contact@pfactory.ru', // list of receivers
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

app.listen(4000, () => console.log('Start server pfactory_mail_node...'));