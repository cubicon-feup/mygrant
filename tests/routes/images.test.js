const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/images');

describe('Test get images', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/images/1/2').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


