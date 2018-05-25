const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/auth');

describe('Test signup', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/auth/signup').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test login', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/auth/login').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
})

describe('Test logout', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/auth/logout').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


