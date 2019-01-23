import * as express from 'express';
import { v4 as uuid } from 'uuid/v4'
import * as sequelize from 'sequelize';

import db from '../db/pgdb';
import hash from '../util/hash';


export default class Register {
    public router = express.Router();

    constructor() {
        this.router.post('/register', this.register); // optional
    }

    private async register(req: express.Request, res: express.Response) {
        let userId = uuid()
        try {
            await db.sequelize.transaction(async (t) => {
                await db.tables.user.create({
                    id: userId,
                    account: req.body.account,
                    password: hash(req.body.password)
                }, { transaction: t })

                await db.tables.user_profile.create({
                    user_id: userId,
                    name: req.body.name,
                    credit: req.body.credit,
                    created_time: new Date(),
                    last_login_time: new Date()
                }, {
                        transaction: t
                    });
            });
        } catch (err) {

        }

        res.end();
    }
}