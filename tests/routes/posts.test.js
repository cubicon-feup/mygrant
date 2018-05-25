const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/posts');

describe('Test comments get the posts made in reply to a post', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/posts/1/comments').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get a post\'s info', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/posts/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test comment post a new post', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/posts/1/comment').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test like a post', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/posts/1/like').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test delete like a post', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/posts/1/like').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test edit a post', () => {
    test('It should response the PUT method', (done) => {
        request(app).post('/api/posts/1/edit').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test delete a post', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/posts/1/delete').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});