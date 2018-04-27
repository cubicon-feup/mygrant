import db from '../../config/database';

jest.mock('../../config/database');


beforeAll((done) => {
    let query = "CREATE TABLE public.users (id integer NOT NULL,email text NOT NULL,pass_hash text NOT NULL,date_joined timestamp with time zone DEFAULT now() NOT NULL,full_name text NOT NULL,bio text,phone text,city text,country text,image_id integer,level integer DEFAULT 1 NOT NULL,experience_points integer DEFAULT 0 NOT NULL,mygrant_balance integer DEFAULT 0 NOT NULL,date_last_transaction timestamp with time zone DEFAULT now() NOT NULL,max_weekly_hours integer DEFAULT 0 NOT NULL,high_level boolean DEFAULT false NOT NULL,verified boolean DEFAULT false NOT NULL,weekly_hours_remaining integer DEFAULT 0 NOT NULL);"
    db.none(query)
        .then(() => {
            console.log("table created");
            done();
        })
        .catch(error => console.log(error));
});

afterAll((done) => {
    let query = "DROP TABLE public.users";
    db.node(query)
        .then(() => {
            console.log("table erased");
            done();
        })
        .catch(error => console.log(error));


});

describe('tests inserting users to database', () => {

    beforeEach((done) => {
        db.none("DELETE FROM public.users")
            .then(() => {
                console.log("delete beforeEach");
                done();
            })
            .catch(error => console.log(error));

    });

    afterEach((done) => {
        db.none("DELETE FROM public.users")
            .then(() => {
                console.log("delete beforeEach");
                done();
            })
            .catch(error => console.log(error));
    });

    it('should have 1 user in database', (done) => {
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

    it('should delete user from database', (done) => {
        let user1 = "INSERT INTO public.users VALUES (9, 'pgrimme8@abc.net.au', '$2a$08$V6gLRKsewz4XSU9TbXrNROzhyePvuJGVRJEzi0duAPx5VhVVzOq4a', '2016-12-24 23:20:55+00', 'Paloma Grimme', 'Front-line value-added infrastructure', '2757077107', 'Shuntian', 'China', 250, 21, 2197, 15, '2018-02-28 01:54:03+00', 48, true, false, 48);";
        let user2 = "INSERT INTO public.users VALUES (33, 'crushfordw@people.com.cn', '$2a$08$srxx9lqLULXOt00DnMIvbe.qJ70OHQL/AvNtAUIQY.t4trABHOuuS', '2015-06-07 15:13:02+01', 'Conrade Rushford', NULL, '5611222795', 'Kotakaya Dua', 'Indonesia', NULL, 45, 4694, 142, '2017-06-13 21:44:44+01', 19, false, false, 19);";
        let del = "DELETE FROM public.users WHERE id=9"
        db.none(user1)
            .then(() => db.none(user2))
            .then(() => db.none(del))
            .then(() => db.many('SELECT * FROM public.users'))
            .then(users => {
                expect(users.length).toBe(1);
            })
            .catch(error => console.log(error));
    });

});

*/