const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/newsfeed');

describe('Test get list of friends posts', () => {
    test('It should response the POST method', (done) => {
        request(app).get('/api/newsfeed/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test id of the user who made the post', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/newsfeed/user/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test Create a microblogging post', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/newsfeed/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test Returns a microblogging post', () => {
    test('It should response the POST method', (done) => {
        request(app).get('/api/newsfeed/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});



describe('Test Edits the content of a microblogging post', () => {
    test('It should response the PUT method', (done) => {
        request(app).put('/api/newsfeed/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test delete the content of a microblogging post', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/newsfeed/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test likes a microblogging post', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/newsfeed/1/like').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test delete likes a microblogging post', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/newsfeed/1/like').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
