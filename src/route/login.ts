import * as express from 'express';

import db from '../db/pgdb';
import hash from '../util/hash';


export default class Register {
    public router = express.Router();

    constructor() {
        this.login = this.login.bind(this);

        this.router.post('/login', this.login); // required
    }

    private async login(req: express.Request, res: express.Response, next: express.NextFunction) {
        let user;
        try {
            user = await this.getUser(req.body.account, req.body.password);

        } catch (err) {
            res.status(200).send('account or password wrong');
            return;
        }
        
        res.json({
            user_id: user.id,
            name: user.user_profile.name
        });
    }

    async getUser(account: string, password: string) {
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
        }).then(result => {
            return result.get({ plain: true });
        })
    }
}