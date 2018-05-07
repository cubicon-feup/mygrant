import  db from '../../config/database';



jest.mock('../../config/database');


beforeAll(async (done) => {

    let table = "CREATE TABLE public.crowdfunding_donation ( id integer NOT NULL, crowdfunding_id integer NOT NULL, donator_id integer NOT NULL, amount integer NOT NULL, date_sent timestamp with time zone DEFAULT now() NOT NULL, rating integer )";
    try {
        await db.none(table);
        done();
    }catch(e) {
        console.log(e);
    }
});

afterAll(async (done) => {
    let dropTable = "DROP TABLE public.crowdfunding_donation";
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
        db.none("DELETE FROM public.crowdfunding_donation")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.crowdfunding_donation")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));
    });

    it('should have 1 crowdfunding donation in database', (done) => {
        let insert = "INSERT INTO public.crowdfunding_donation VALUES (1, 12, 13, 500, '2017-10-12 11:01:47+01', 44 )";
        let select = "SELECT * FROM public.crowdfunding_donation WHERE id = 1";

        db.none(insert)
            .then(() => db.many(select))
            .then(donations => {
                expect(donations.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });

    it('crowdfunding donation should match object', (done) => {
        let insert = "INSERT INTO public.crowdfunding_donation VALUES (1, 12, 13, 500, '2017-10-12 11:01:47+01', 44 )";
        let select = "SELECT * FROM public.crowdfunding_donation WHERE id = 1";
        db.none(insert)
            .then(() => db.one(select))
            .then(donation => {
                expect(donation).toMatchObject({
                    id : 1 ,
                    crowdfunding_id : 12 ,
                    donator_id : 13 ,
                    amount : 500 ,
                    //    date_sent : , '2017-10-12 11:01:47+01',
                    rating : 44

                });
                done();
            })
            .catch(error => console.log(error));
    });
});

