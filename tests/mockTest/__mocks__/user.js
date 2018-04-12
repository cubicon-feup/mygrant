
let user = {
    name : 'paul',
    password : 'paulsecret',
    age : 29
};

exports.getUser = () => {
    return user;
};

exports.setUser = (name,password,age) => {
    user.name = name;
    user.password = password;
    user.age = age;
};

exports.setName = (name) => {
    user.name = name;
};