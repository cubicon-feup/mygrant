const request = require('supertest');
const app = require('../../app');

jest.mock('../../routes/crowdfundings');

describe('Test post crowdfunding', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/crowdfundings/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test get crowdfunding', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/crowdfundings/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test update crowdfunding', () => {
    test('It should response the PUT method', (done) => {
        request(app).put('/api/crowdfundings/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test update crowdfunding', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/crowdfundings/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get  crowdfunding rating', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/crowdfundings/1/rating').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test get  crowdfundings', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/crowdfundings/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test post  crowdfundings', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/crowdfundings/1/donations').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get  crowdfundings donations', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/crowdfundings/1/donations').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test update crowdfunding rating', () => {
    test('It should response the PUT method', (done) => {
        request(app).put('/api/crowdfundings/1/rating').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get crowdfunding images', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/crowdfundings/1/images').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});



describe('Test update crowdfunding images', () => {
    test('It should response the PUT method', (done) => {
        request(app).put('/api/crowdfundings/1/images').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test delete crowdfunding images', () => {
    test('It should response the DELETE method', (done) => {
        request(app).delete('/api/crowdfundings/1/images/1').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test post services  offer to crowdfunding', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/crowdfundings/1/services_offers/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});


describe('Test post services  offer to crowdfunding', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/crowdfundings/1/services_offers/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test post services_requested to crowdfunding', () => {
    test('It should response the POST method', (done) => {
        request(app).post('/api/crowdfundings/1/services_requested/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('Test get services  offer to crowdfunding', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/api/crowdfundings/1/services_offers/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});



