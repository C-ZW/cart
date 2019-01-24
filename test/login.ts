import * as chai from 'chai';
import app from '../src/app';
import db from '../src/db/pgdb';
import { v4 as uuid } from 'uuid';
import hash from '../src/util/hash';

chai.use(require('chai-http'));
chai.use(require('chai-json'));
let expect = chai.expect;

let user1 = {
    userId: uuid(),
    account: 'testAccount',
    password: 'password',
    name: 'login test',
    credit: 12345,
    created_time: new Date(),
    last_login_time: new Date()
}

describe('login', () => {
    beforeEach((done) => {
        db.sequelize.transaction(async (t) => {
            await deleteUser(t);
            await createUser(t);
            await createProfile(t);
            done();
        });
    });

    describe('/POST login', () => {
        it('it should login', (done) => {
            let user = {
                account: 'testAccount',
                password: 'password',
            }

            chai.request(app)
                .post('/api/login')
                .send(user)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).have.header('content-type', 'application/json; charset=utf-8')
                    expect(res.body.user_id, 'user_id').is.not.undefined;
                    expect(res.body.name).equals(user1.name);
                    done();
                });
        });
    });

    afterEach((done) => {
        deleteUser(null);
        done();
    });
});

async function createUser(t) {
    return db.tables.user.create({
        id: user1.userId,
        account: user1.account,
        password: hash(user1.password)
    }, { transaction: t })
}

async function createProfile(t) {
    return db.tables.user_profile.create({
        user_id: user1.userId,
        name: user1.name,
        credit: user1.credit,
        created_time: user1.created_time,
        last_login_time: user1.last_login_time
    }, {
            transaction: t
        });
}

async function deleteUser(t) {
    return db.tables.user.destroy({
        where: { account: 'testAccount' },
        cascade: true,
        transaction: t
    })
}