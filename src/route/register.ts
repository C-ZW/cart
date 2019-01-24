import * as express from 'express';
import { v4 as uuid } from 'uuid/v4'
import * as sequelize from 'sequelize';

import db from '../db/pgdb';
import hash from '../util/hash';

interface NewUser {
    userId: sequelize.DataTypeUUIDv4,
    account: string,
    password: string,
    name: string,
    credit: number,
    created_time: Date,
    last_login_time: Date
}

export default class Register {
    public router = express.Router();

    constructor() {
        this.register = this.register.bind(this);

        this.router.post('/register', this.register); // optional
    }

    private async register(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let newUser = this.userTemplate(req);

            await db.sequelize.transaction(async (t) => {
                await this.createUser(newUser, t);
                await this.createProfile(newUser, t);
            });
            
        } catch (err) {
            res.send('account existed');
        }

        res.end();
    }

    userTemplate(req: express.Request): NewUser {
        return {
            userId: uuid(),
            account: req.body.account,
            password: hash(req.body.password),
            name: req.body.name,
            credit: req.body.credit,
            created_time: new Date(),
            last_login_time: new Date()
        }
    }

    createUser(user: NewUser, t: sequelize.Transaction) {
        return db.tables.user.create({
            id: user.userId,
            account: user.account,
            password: user.password
        }, { transaction: t })
    }

    createProfile(user: NewUser, t: sequelize.Transaction) {
        return db.tables.user_profile.create({
            user_id: user.userId,
            name: user.name,
            credit: user.credit,
            created_time: user.created_time,
            last_login_time: user.last_login_time
        }, {
                transaction: t
            });
    }
}