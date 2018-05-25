const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/users');

describe('Test get user', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/users/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test update users', () => {
    test('It should response the PUT method', (done) => {
        request(app).put('/api/users').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
})

describe('Test post image', () => {
    test('It should response the GET method', (done) => {
        request(app).post('/api/users/image').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get users', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/users').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get user friends', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/users/1/friends').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get users', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/users/add_friend').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get users', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/users/add_friend').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get users', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/users/friend_request').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get users', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/users/friend_request').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get blocked users', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/users/1/blocked').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test  block user', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/users/block_user').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test  unblock user', () => {
    test('It should response the GET method', (done) => {
        request(app).delete('/api/users/block_user').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test post loan request', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/users/loan_request').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test delete loan request', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/users/loan_request').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test post loan ', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/users/loan').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test post donation request ', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/users/donation_request').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test delete  donation request', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/users/donation_request').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test post  donation ', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/users/donation').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test post  set location ', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/users/set_location').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test post  set location ', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/users/1/provides').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});