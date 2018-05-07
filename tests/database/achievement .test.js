import  db from '../../config/database';



jest.mock('../../config/database');


beforeAll(async (done) => {

    let table = "CREATE TABLE public.achievement (id integer NOT NULL, achievement_name text NOT NULL, description text NOT NULL,exp_reward integer DEFAULT 0 NOT NULL,image_url text NOT NULL)";
    try {
        await db.none(table);
        done();
    }catch(e) {
        console.log(e);
    }
});

afterAll(async (done) => {
    let dropTable = "DROP TABLE public.achievement";
    try {
        await db.none(dropTable);
        await db.$pool.end();
        done();

    }catch(e) {
        console.log(e);
    }




});

describe('tests inserting achievements to database', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.achievement")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.achievement")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));
    });

    it('should have 1 achievement in database', (done) => {
        let insert = "INSERT INTO public.achievement VALUES (1, 'Horizontal solution-oriented workforce', 'Automated contextually-based local area network', 12, 'http://dummyimage.com/555x555.png')";
        db.none(insert)
            .then(() => db.many('SELECT * FROM public.achievement'))
            .then(achievements => {
                expect(achievements.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });

    it('achievement should match object', (done) => {
        let insert = "INSERT INTO public.achievement VALUES (1, 'Horizontal solution-oriented workforce', 'Automated contextually-based local area network', 12, 'http://dummyimage.com/555x555.png')";

        let select = "SELECT * FROM public.achievement WHERE id = 1";
        db.none(insert)
            .then(() => db.one(select))
            .then(achievement => {
                expect(achievement).toMatchObject({
                    id: 1,
                    achievement_name : 'Horizontal solution-oriented workforce',
                    description : 'Automated contextually-based local area network',
                    exp_reward : 12,
                    image_url  : 'http://dummyimage.com/555x555.png'

                });
                done();
            })
            .catch(error => console.log(error));
    });
});

