import * as chai from 'chai';
import app from '../src/app';
import db from '../src/db/pgdb';
import { v4 as uuid } from 'uuid';
import hash from '../src/util/hash';

chai.use(require('chai-http'));
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


describe('User', () => {
    beforeEach((done) => {
        db.sequelize.transaction(async (t) => {
            await deleteUser(t);
            await createUser(t);
            await createProfile(t);
            done();
        });

        addProduct('test product1');
        addProduct('test product2');

    });

    describe('/POST /api/user/deposit', () => {
        it('it should add amount', (done) => {
            chai.request(app)
                .post('/api/user/deposit')
                .send({
                    user_id: user1.userId,
                    amount: 999
                })
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

    describe('/POST /api/user', () => {
        it('it should get profile', (done) => {
            chai.request(app)
                .post('/api/user')
                .send({
                    account: user1.account
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).have.header('content-type', 'application/json; charset=utf-8')

                    expect(res.body.account).equals(user1.account);
                    expect(res.body.name).equals(user1.name);
                    expect(res.body.credit).is.not.undefined;
                    expect(res.body.created_time).is.not.undefined;
                    expect(res.body.last_login_time).is.not.undefined;
                    done();
                });
        });
    });

    describe('/POST /api/user/history', () => {
        it('it should get shopping distory without history', (done) => {
            chai.request(app)
                .post('/api/user/history')
                .send({
                    user_id: user1.userId,
                    amount: 999
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).have.header('content-type', 'application/json; charset=utf-8')

                    expect(res.body.account).equals(user1.account);
                    expect(res.body.name).equals(user1.name);
                    expect(res.body.order_list).to.be.an('array');
                    expect(res.body.user_id, 'user_id').is.not.undefined;
                    done();
                });
        });

        it('it should get shopping distory with history', (done) => {
            chai.request(app)
                .post('/api/user/history')
                .send({
                    user_id: user1.userId,
                    amount: 321
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).have.header('content-type', 'application/json; charset=utf-8')

                    expect(res.body.account).equals(user1.account);
                    expect(res.body.name).equals(user1.name);
                    expect(res.body.order_list).to.be.an('array');
                    expect(res.body.user_id, 'user_id').is.not.undefined;
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

async function addProduct(name) {
    return db.tables.product.create({
        id: uuid(),
        name: name,
        stock: 10,
        price: 100
    });
}

async function getProducts(name) {
    
}

async function deleteUser(t) {
    return db.tables.user.destroy({
        where: { account: 'testAccount' },
        cascade: true,
        transaction: t
    })
}