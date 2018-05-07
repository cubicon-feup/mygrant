import  db from '../../config/database';



jest.mock('../../config/database');


beforeAll(async (done) => {

    let table = "CREATE TABLE public.comment ( id integer NOT NULL, sender_id integer NOT NULL, message text NOT NULL, service_id integer, crowdfunding_id integer, date_posted timestamp with time zone DEFAULT now() NOT NULL, in_reply_to integer, edit_history text[] )";
    try {
        await db.none(table);
        done();
    }catch(e) {
        console.log(e);
    }
});

afterAll(async (done) => {
    let dropTable = "DROP TABLE public.comment";
    try {
        await db.none(dropTable);
        await db.$pool.end();
        done();
    }catch(e) {
        console.log(e);
    }
});

describe('tests inserting comments to database', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.comment")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.comment")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));
    });

    it('should have 1 comment in database', (done) => {
        let insert = "INSERT INTO public.comment VALUES (1, 12, 'Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.', 961, NULL, '2015-06-05 03:53:49+01', NULL, NULL)";
        db.none(insert)
            .then(() => db.many('SELECT * FROM public.comment'))
            .then(users => {
                expect(users.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });

    it('user should match object', (done) => {
        let insert = "INSERT INTO public.comment VALUES (9, 773, 'Nulla ut erat id mauris vulputate elementum.', 984, NULL, '2017-10-12 11:01:47+01', NULL, NULL)";
        let select = "SELECT * FROM public.comment WHERE id = 9";
        db.none(insert)
            .then(() => db.one(select))
            .then(user => {
                expect(user).toMatchObject({
                    id : 9,
                    sender_id : 773,
                    message : 'Nulla ut erat id mauris vulputate elementum.',
                    service_id : 984,
                    crowdfunding_id : null,
                   // date_posted : '2017-10-12 11:01:47+01',
                    in_reply_to : null,
                    edit_history : null

                });
                done();
            })
            .catch(error => console.log(error));
    });
});

