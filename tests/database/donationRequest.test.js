import  db from '../../config/database';



jest.mock('../../config/database');


beforeAll(async (done) => {
    let table = "CREATE TABLE public.donation_request  ( id integer NOT NULL, sender_id  integer NOT NULL, receiver_id integer NOT NULL, amount integer NOT NULL, date_sent timestamp with time zone DEFAULT now() NOT NULL )";
    try {
        await db.none(table);
        done();
    }catch(e) {
        console.log(e);
    }
});

afterAll(async (done) => {
    let dropTable = "DROP TABLE public.donation_request";
    try {
        await db.none(dropTable);
        await db.$pool.end();
        done();
    }catch(e) {
        console.log(e);
    }
});

describe('tests inserting donation requests to database', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.donation_request")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.donation_request")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));
    });

    it('should have 1 donation request in database', (done) => {
        let insert = "INSERT INTO public.donation_request VALUES (1, 12, 13, 500, '2017-10-12 11:01:47+01' )";
        let select = "SELECT * FROM public.donation_request WHERE id = 1";

        db.none(insert)
            .then(() => db.many(select))
            .then(donations => {
                expect(donations.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });

    it('donation request should match object', (done) => {
        let insert = "INSERT INTO public.donation_request VALUES (1, 12, 13, 500, '2017-10-12 11:01:47+01' )";
        let select = "SELECT * FROM public.donation_request WHERE id = 1";
        db.none(insert)
            .then(() => db.one(select))
            .then(donation => {
                expect(donation).toMatchObject({
                    id : 1 ,
                    sender_id : 12 ,
                    receiver_id : 13 ,
                    amount : 500
                    //    date_sent : , '2017-10-12 11:01:47+01'

                });
                done();
            })
            .catch(error => console.log(error));
    });
});

