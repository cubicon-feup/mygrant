module.exports = {
    joiOptions: {
        allowUnknown: true
    },
    regex: {
        line: /^[a-zA-Z0-9 záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ.,?!\-;:()]*$/,
        multiLine: /^[a-zA-Z0-9 \nzáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ.,?!\-;:()]*$/,
        username: /^[a-zA-Z0-9]{6,32}$/,
        password: /^[a-zA-Z0-9]{8,32}$/,
        email: /^.*@.*$/,
        name: /^[a-zA-Z0-9 záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ.,?!\-;:()]{3,32}$/
    },
    transporterOptions: {
        service: 'Gmail',
        auth: {
            user: process.env.MYGRANT_EMAIL,
            pass: process.env.MYGRANT_PASS
        }
    },
    messageNotificationOptions: {
        from: `"Mygrant - New Message" <${process.env.MYGRANT_EMAIL}>`, // sender address
        subject: 'Message Notification', // Subject line
    }
}