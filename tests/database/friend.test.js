import  db from '../../config/database';



jest.mock('../../config/database');


beforeAll(async (done) => {

    let table = "CREATE TABLE public.friend_request ( sender_id integer NOT NULL, receiver_id integer NOT NULL, date_sent timestamp with time zone DEFAULT now() NOT NULL );";
    try {
        await db.none(table);
        done();
    }catch(e) {
        console.log(e);
    }
});

afterAll(async (done) => {
    let dropTable = "DROP TABLE public.friend_request";
    try {
        await db.none(dropTable);
        await db.$pool.end();
        done();

    }catch(e) {
        console.log(e);
    }




});

describe('tests inserting friend requests to database', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.friend_request")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.friend_request")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));
    });



    it('should have friend request in database', (done) => {
        let insert = "INSERT INTO public.friend_request VALUES (1,2, '2017-10-12 11:01:47+01' )";
        let select = "SELECT * FROM public.friend_request WHERE sender_id   = 1";
        db.none(insert)
            .then(() => db.many(select))
            .then(requests => {
                expect(requests.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });

    it('request should match object', (done) => {
        let insert = "INSERT INTO public.friend_request VALUES (1,2, '2017-10-12 11:01:47+01' )";
        let select = "SELECT * FROM public.friend_request WHERE sender_id   = 1";
        db.none(insert)
            .then(() => db.one(select))
            .then(request => {
                expect(request).toMatchObject({
                    sender_id : 1,
                    receiver_id : 2,
                    //    date_sent : , '2017-10-12 11:01:47+01'

                });
                done();
            })
            .catch(error => console.log(error));
    });
});

