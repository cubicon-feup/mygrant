const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/services');

describe('Test Get service\'s list', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/services/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test Get service', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/services/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test create service', () => {
    test('It should response the UPT method', (done) => {
        request(app).put('/api/services/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test edit service', () => {
    test('It should response the PUT method', (done) => {
        request(app).put('/api/services/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test delete service', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/services/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get service images', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/services/1/images').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test update service images', () => {
    test('It should response the PUT method', (done) => {
        request(app).put('/api/services/1/images').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test delete service images', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/services/1/images/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get service offers', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/services/1/offers').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test post service offers', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/services/1/offers').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test accept service offers', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/services/1/offers/accept').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test decline service offers', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/services/1/offers/decline').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test review service ', () => {
    test('It should response the PUT method', (done) => {
        request(app).put('/api/services/instance/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
