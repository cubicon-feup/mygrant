import  db from '../../config/database';



jest.mock('../../config/database');


beforeAll(async (done) => {

    let table = "CREATE TABLE public.crowdfunding_image ( crowdfunding_id integer NOT NULL, image_url text NOT NULL )";
    try {
        await db.none(table);
        done();
    }catch(e) {
        console.log(e);
    }
});

afterAll(async (done) => {
    let dropTable = "DROP TABLE public.crowdfunding_image";
    try {
        await db.none(dropTable);
        await db.$pool.end();
        done();

    }catch(e) {
        console.log(e);
    }




});

describe('tests inserting crowdfunding images to database', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.crowdfunding_image")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.crowdfunding_image")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));
    });



    it('should have 1 image in database', (done) => {
        let insert = "INSERT INTO public.crowdfunding_image VALUES (1,'http://dummyimage.com/555x555.png')";
        let select = "SELECT * FROM public.crowdfunding_image WHERE crowdfunding_id  = 1";
        db.none(insert)
            .then(() => db.many(select))
            .then(images => {
                expect(images.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });

    it('image should match object', (done) => {
        let insert = "INSERT INTO public.crowdfunding_image VALUES (1,'http://dummyimage.com/555x555.png')";
        let select = "SELECT * FROM public.crowdfunding_image WHERE crowdfunding_id  = 1";
        db.none(insert)
            .then(() => db.one(select))
            .then(image => {
                expect(image).toMatchObject({
                    crowdfunding_id : 1,
                    image_url : 'http://dummyimage.com/555x555.png'
                });
                done();
            })
            .catch(error => console.log(error));
    });
});

