import db from '../config/database';

jest.mock('../config/database');


afterAll( async (done) => {

    let someshit = await db.connect();
    console.log(someshit.client.connection.end());
    done();
});


describe('tests inserting users to database', () => {

    beforeEach(async (done) => {
       await db.none("DELETE FROM public.users");
       done();
            /*.then(() => {
                done();
            })
            .catch(error => console.log(error));*/

    });

    afterEach(async (done) => {
        await db.none("DELETE FROM public.users");
        done();
           /* .then(() => {
                done();
            })
            .catch(error => console.log(error));*/

    });

    it('should insert an user', (done) => {
        let insert = "INSERT INTO public.users VALUES (9, 'pgrimme8@abc.net.au', '$2a$08$V6gLRKsewz4XSU9TbXrNROzhyePvuJGVRJEzi0duAPx5VhVVzOq4a', '2016-12-24 23:20:55+00', 'Paloma Grimme', 'Front-line value-added infrastructure', '2757077107', 'Shuntian', 'China', 250, 21, 2197, 15, '2018-02-28 01:54:03+00', 48, true, false, 48);";
        db.none(insert)
            .then(() => db.many('SELECT * FROM public.users'))
            .then(users => {
                expect(users.length).toBe(1);
                done();
            })
            .catch(error => console.log(error));
    });
    /*
    it('user should match object', (done) => {
        let insert = "INSERT INTO public.users VALUES (9, 'pgrimme8@abc.net.au', '$2a$08$V6gLRKsewz4XSU9TbXrNROzhyePvuJGVRJEzi0duAPx5VhVVzOq4a'," +
            " '2016-12-24 23:20:55+00', 'Paloma Grimme', 'Front-line value-added infrastructure'," +
            " '2757077107', 'Shuntian', 'China', 250, 21, 2197, 15, '2018-02-28 01:54:03+00', 48, true, false, 48);";
        let select = "SELECT * FROM public.users WHERE id = 9";
        db.none(insert)
            .then(() => db.one(select))
            .then(user => {
                expect(user).toMatchObject({
                    id: 9,
                    email: "pgrimme8@abc.net.au",
                    pass_hash: "$2a$08$V6gLRKsewz4XSU9TbXrNROzhyePvuJGVRJEzi0duAPx5VhVVzOq4a",
                    // date_joined: "2016-12-24T23:20:55.000Z",
                    full_name: "Paloma Grimme",
                    bio: "Front-line value-added infrastructure",
                    phone: "2757077107",
                    city: "Shuntian",
                    country: "China",
                    image_id: 250,
                    level: 21,
                    experience_points: 2197,
                    mygrant_balance: 15,
                    //date_last_transaction : "2018-02-28 01:54:03+00",
                    max_weekly_hours: 48,
                    high_level: true,
                    verified: false,
                    weekly_hours_remaining: 48
                });
                done();
            })
            .catch(error => console.log(error));
    });*/
});

/*
describe('tests deleting from table users', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.users")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.users")
            .then(() => {
                done();
            })
            .catch(error => console.log(error));

    });

    it('should insert an user in database', (done) => {
        let user1 = "INSERT INTO public.users VALUES (9, 'pgrimme8@abc.net.au', '$2a$08$V6gLRKsewz4XSU9TbXrNROzhyePvuJGVRJEzi0duAPx5VhVVzOq4a', '2016-12-24 23:20:55+00', 'Paloma Grimme', 'Front-line value-added infrastructure', '2757077107', 'Shuntian', 'China', 250, 21, 2197, 15, '2018-02-28 01:54:03+00', 48, true, false, 48);";
        let user2 = "INSERT INTO public.users VALUES (33, 'crushfordw@people.com.cn', '$2a$08$srxx9lqLULXOt00DnMIvbe.qJ70OHQL/AvNtAUIQY.t4trABHOuuS', '2015-06-07 15:13:02+01', 'Conrade Rushford', NULL, '5611222795', 'Kotakaya Dua', 'Indonesia', NULL, 45, 4694, 142, '2017-06-13 21:44:44+01', 19, false, false, 19);";
        let del = "DELETE FROM public.users WEHRE id = 9";
        db.none(user1)
            .then(() => db.none(user2))
            .then(() => db.many('SELECT * FROM public.users'))
            .then(users => {
                expect(users.length).toBe(2);
                db.none(del)
            })
            .then(() => db.many('SELECT * FROM public.users'))
            .then(() => {
                expect(users.length).toBe(1);
                done;
            })

            .catch(error => console.log(error));
    });

});*/

