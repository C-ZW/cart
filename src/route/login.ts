import * as express from 'express';

import db from '../db/pgdb';
import hash from '../util/hash';
import { isUndefined } from 'util';


export default class Register {
    public router = express.Router();

    constructor() {
        this.login = this.login.bind(this);

        this.router.post('/login', this.login); // required
    }

    private async login(req: express.Request, res: express.Response, next: express.NextFunction) {
        let user;
        try {
            if(isUndefined(req.body) || isUndefined(req.body.account) || isUndefined(req.body.password)) {
                res.status(400).end();
                return;
            }
            user = await this.getUser(req.body.account, req.body.password);
            this.updateLoginTime(user);
        } catch (err) {
            res.status(200).send('account or password wrong');
            return;
        }

        res.json({
            user_id: user.id,
            name: user.user_profile.name
        });
    }

    private async getUser(account: string, password: string) {
        return db.tables.user.findOne({
            where: {
                account: account,
                password: hash(password)
            },
            include: [{
                model: db.tables.user_profile,
                attributes: ['user_id', 'name'],
                required: false
            }],
            attributes: [
                'id'
            ]
        }).then(user => {
            return user.get({ plain: true });
        })
    }

    private async updateLoginTime(user) {
        return db.tables.user_profile.update({
            last_login_time: new Date()
        }, {
            where: {
                user_id: user.id
            }
        });
    }
}