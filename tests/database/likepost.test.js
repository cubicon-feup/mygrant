import  db from '../../config/database';



jest.mock('../../config/database');


beforeAll(async (done) => {

    let table = "CREATE TABLE public.like_post ( user_id integer NOT NULL, post_id integer NOT NULL );"
    try {
        await db.none(table);
        done();
    }catch(e) {
        console.log(e);
    }
});

afterAll(async (done) => {
    let dropTable = "DROP TABLE public.like_post";
    try {
        await db.none(dropTable);
        await db.$pool.end();
        done();

    }catch(e) {
        console.log(e);
    }




});

describe('tests inserting likes to database', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.like_post")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.like_post")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));
    });



    it('should have 1 like  in database', (done) => {
        let insert = "INSERT INTO public.like_post VALUES (1,2 )";
        let select = "SELECT * FROM public.like_post WHERE user_id   = 1";
        db.none(insert)
            .then(() => db.many(select))
            .then(likes => {
                expect(likes.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });

    it('like should match object', (done) => {
        let insert = "INSERT INTO public.like_post VALUES (1,2)";
        let select = "SELECT * FROM public.like_post WHERE user_id   = 1";
        db.none(insert)
            .then(() => db.one(select))
            .then(request => {
                expect(request).toMatchObject({
                    user_id : 1,
                    post_id : 2,

                });
                done();
            })
            .catch(error => console.log(error));
    });
});

