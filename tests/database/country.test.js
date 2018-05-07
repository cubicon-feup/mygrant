import  db from '../../config/database';



jest.mock('../../config/database');


beforeAll(async (done) => {

    let table = "CREATE TABLE public.country ( id integer NOT NULL, name text NOT NULL, code text NOT NULL )";
    try {
        await db.none(table);
        done();
    }catch(e) {
        console.log(e);
    }
});

afterAll(async (done) => {
    let dropTable = "DROP TABLE public.country";
    try {
        await db.none(dropTable);
        await db.$pool.end();
        done();

    }catch(e) {
        console.log(e);
    }




});

describe('tests inserting countrys to database', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.country")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.country")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));
    });

    it('should have 1 country in database', (done) => {
        let insert = "INSERT INTO public.country VALUES (1,'Portugal', 1337)";
        let select = "SELECT * FROM public.country WHERE id = 1";
        db.none(insert)
            .then(() => db.many(select))
            .then(countrys => {
                expect(countrys.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });

    it('country should match object', (done) => {
        let insert = "INSERT INTO public.country VALUES (1,'Portugal', 1337)";
        let select = "SELECT * FROM public.country WHERE id = 1";
        db.none(insert)
            .then(() => db.one(select))
            .then(country => {
                expect(country).toMatchObject({
                    id: 1,
                    name : 'Portugal',
                    code : '1337'

                });
                done();
            })
            .catch(error => console.log(error));
    });
});

