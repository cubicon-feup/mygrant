const request = require('supertest');
const app = require('../app')



describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});

describe('appInfo routes test', function () {

    it('appName should be Mygrant', function (done) {
        request(app)
            .get('/api/app_info')
            .set('Accept', 'application/json')
            .then((response) => {
                expect(response.body.appName).toBe("Mygrant");
                 /*   appName: 'Mygrant',
                    client: 'Gallyciadas',
                    company: 'cubicon',
                    year: 2018
                });*/
                done();
            })
    });

    it('client name  should be Gallyciadas', function (done) {
        request(app)
            .get('/api/app_info')
            //.set('Accept', 'application/json')
            .then((response) => {
                expect(response.body.client).toBe("Gallyciadas");
                /*   appName: 'Mygrant',
                   client: 'Gallyciadas',
                   company: 'cubicon',
                   year: 2018
               });*/
                done();
            })
    });

    it('company should be cubicon', function (done) {
        request(app)
            .get('/api/app_info')
            //.set('Accept', 'application/json')
            .then((response) => {
                expect(response.body.company).toBe("cubicon");
                /*   appName: 'Mygrant',
                   client: 'Gallyciadas',
                   company: 'cubicon',
                   year: 2018
               });*/
                done();
            })
    });

    it('year should be 2018', function (done) {
        request(app)
            .get('/api/app_info')
            //.set('Accept', 'application/json')
            .then((response) => {
                expect(response.body.year).toBe(2018);
                /*   appName: 'Mygrant',
                   client: 'Gallyciadas',
                   company: 'cubicon',
                   year: 2018
               });*/
                done();
            })
    });


    it('year should be 2018', function (done) {
        request(app)
            .get('/api/app_info')
            //.set('Accept', 'application/json')
            .then((response) => {
                expect(response.body.year).toBe(2018);
                /*   appName: 'Mygrant',
                   client: 'Gallyciadas',
                   company: 'cubicon',
                   year: 2018
               });*/
                done();
            })
    });

    it('year should be 2018', function (done) {
        request(app)
            .get('/api/app_info')
            //.set('Accept', 'application/json')
            .then((response) => {
                expect(response.body).toMatchObject({
                    appName : expect.any(String),
                    client : expect.any(String),
                    company : expect.any(String),
                    year : expect.any(Number)
                });
                done();
            })
    });


});