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
    rating: {
        min: 1,
        max: 3
    }
}