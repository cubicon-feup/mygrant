const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/messages');

describe('Test post messages', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/messages/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test get  messages between users', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/messages/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test get interactions for the user', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/messages/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});




