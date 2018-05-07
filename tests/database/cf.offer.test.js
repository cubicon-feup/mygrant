import  db from '../../config/database';



jest.mock('../../config/database');


beforeAll(async (done) => {

    let table = "CREATE TABLE public.crowdfunding_offer ( service_id integer NOT NULL, crowdfunding_id integer NOT NULL )";
    try {
        await db.none(table);
        done();
    }catch(e) {
        console.log(e);
    }
});

afterAll(async (done) => {
    let dropTable = "DROP TABLE public.crowdfunding_offer";
    try {
        await db.none(dropTable);
        await db.$pool.end();
        done();

    }catch(e) {
        console.log(e);
    }




});

describe('tests inserting crowdfunding offers to database', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.crowdfunding_offer")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.crowdfunding_offer")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));
    });



    it('should have 1 country in database', (done) => {
        let insert = "INSERT INTO public.crowdfunding_offer VALUES (1,2)";
        let select = "SELECT * FROM public.crowdfunding_offer WHERE service_id   = 1";
        db.none(insert)
            .then(() => db.many(select))
            .then(users => {
                expect(users.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });

    it('user should match object', (done) => {
        let insert = "INSERT INTO public.crowdfunding_offer VALUES (1,2)";
        let select = "SELECT * FROM public.crowdfunding_offer WHERE service_id   = 1";
        db.none(insert)
            .then(() => db.one(select))
            .then(user => {
                expect(user).toMatchObject({
                    service_id : 1,
                    crowdfunding_id : 2,

                });
                done();
            })
            .catch(error => console.log(error));
    });
});

