import * as chai from 'chai';
import app from '../src/app';
import db from '../src/db/pgdb';

chai.use(require('chai-http'));
let expect = chai.expect;

describe('Register', () => {
    beforeEach(deleteUser);

    describe('/POST register', () => {
        it('it should register', (done) => {
            let user1 = {
                account: 'testAccount',
                password: 'password',
                name: 'user1',
                credit: 2000
            }

            chai.request(app)
                .post('/api/register')
                .send(user1)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    afterEach(deleteUser);
});

async function deleteUser(done) {
    db.tables.user.destroy({
        where: { account: 'testAccount' },
        cascade: true
    }).catch(err => {
        throw err;
    });

    done();
}