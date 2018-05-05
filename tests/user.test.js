import user from './mockTest/user';

it('getUser() return  be equal to object(user) ', () => {
    expect(user.getUser()).toEqual({
        name: 'mark',
        password: 'secret',
        age: 27
    });
});

it('name should be marl', () => {
    expect(user.getUser().name).toEqual('mark');
});

it('object should match object', () => {
    expect(user.getUser()).toMatchObject({
        name: expect.any(String),
        password: expect.any(String),
        age: expect.any(Number)
    });
});

it('password should be secret', () => {
    expect(user.getUser().password).toEqual('secret');
});

it('age should be greater then 26', () => {
    expect(user.getUser().age).toBeGreaterThan(26);
});

it('age should be less or equal than 27', () => {
    expect(user.getUser().age).toBeLessThanOrEqual(27);
});
