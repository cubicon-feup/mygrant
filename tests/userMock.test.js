import user from './mockTest/user'

jest.mock('./mockTest/user');

it('name should be  paul ', () => {
    expect(user.getUser().name).toEqual('paul' );
});

it('name should be  jhonyyyy', () => {
    user.setName('jhonyyyy');
    expect(user.getUser().name).toEqual('jhonyyyy' );
});

it('name should be  jhonyyyy', () => {
    expect(user.getUser().name).toEqual('jhonyyyy' );
});


describe('test with before each and after each', () => {
    beforeEach(() => {
        user.setName('paul');
    });

    afterEach(() => {

    });

    it('name should be  paul ', () => {
        expect(user.getUser().name).toEqual('paul' );
    });

    it('name should be  jhonyyyy', () => {
        user.setName('jhonyyyy');
        expect(user.getUser().name).toEqual('jhonyyyy' );
    });

    it('name should be  paul', () => {
        expect(user.getUser().name).toEqual('paul' );
    });

});