const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/users');

describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/users/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/users').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});