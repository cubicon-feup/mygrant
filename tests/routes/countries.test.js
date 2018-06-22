const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/countries');

describe('Test get all comment', () => {
    test('It should response the get method', (done) => {
        request(app).get('/api/countries/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test list of countries as options', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/countries/as_options').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
