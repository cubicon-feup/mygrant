const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/comments');

describe('Test update comment', () => {
    test('It should response the PUT method', (done) => {
        request(app).put('/api/comments/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test get comments', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/comments/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get top comments', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/comments/top_comments').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test get nested  comments', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/comments/1/nested_comments').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test update comment', () => {
    test('It should response the GET method', (done) => {
        request(app).put('/api/comments/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test delete comment', () => {
    test('It should response the delete method', (done) => {
        request(app).delete('/api/comments/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});