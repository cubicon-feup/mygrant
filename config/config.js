const secret = process.env.MYGRANT_SECRET || 'lamesecret';
const dbDatabase = process.env.DATA_DB_DB || 'mygrant';
const dbHost = process.env.DATA_DB_HOST || 'localhost';
const dbPass = process.env.DATA_DB_PASS || 'pgsql';
const dbUser = process.env.DATA_DB_USER || 'postgres';

module.exports = {
    dbConfig: {
        database: dbDatabase,
        host: dbHost,
        password: dbPass,
        port: 5432,
        user: dbUser
    },
    joiOptions: { allowUnknown: true },
    messageNotificationOptions: {
        // sender address
        from: `"Mygrant - New Message" <${process.env.MYGRANT_EMAIL}>`,
        // Subject line
        subject: 'Message Notification'
    },
    regex: {
        email: /^.*@.*$/,
        line: /^[a-zA-Z0-9 záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ.,?!\-;:()]*$/,
        multiLine: /^[a-zA-Z0-9 \nzáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ.,?!\-;:()]*$/,
        name: /^[a-zA-Z0-9 záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ.,?!\-;:()]{3,32}$/,
        password: /^[a-zA-Z0-9]{8,32}$/,
        username: /^[a-zA-Z0-9]{6,32}$/
    },
    rating: {
        min: 1,
        max: 3
    },
    secret,
    transporterOptions: {
        auth: {
            pass: process.env.MYGRANT_PASS,
            user: process.env.MYGRANT_EMAIL
        },
        service: 'Gmail'
    },
    initialMygrantBalance: 20
};
