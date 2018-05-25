const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/categories');

describe('Test service_categories', () => {
    test('It should response the POST method', (done) => {
        request(app).get('/api/service_categories/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


