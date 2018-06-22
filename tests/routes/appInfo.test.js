const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/appInfo');

describe('Test route user', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});