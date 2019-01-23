import * as chai from 'chai';
import {v4} from 'uuid';
import app from '../src/app';
import tables from '../src/db/pgdb';

chai.use(require('chai-http'));
let expect = chai.expect;

describe('Register', () => {
    beforeEach((done) => {
        tables.user.destroy({
            where: { account: 'testAccount' },
            cascade: true
        }).catch(err => {
            throw err;
        });
        
        done();
    });

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
});