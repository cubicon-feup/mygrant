const user = {
    name: 'mark',
    password: 'secret',
    age: 27
};

exports.getUser = () => user;

exports.setUser = (name, password, age) => {
    user.name = name;
    user.password = password;
    user.age = age;
};

exports.setName = name => {
    user.name = name;
};
