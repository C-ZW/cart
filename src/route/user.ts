import * as express from 'express';
import db from '../db/pgdb';

export default class User {
    public router = express.Router();

    constructor() {
        this.router.post('/user/history', this.getHistory); // required
        this.router.post('/user/deposit ', this.deposit); // optional
        this.router.post('/user', this.getUser); // optional
        this.router.post('/user/operation', this.getOperation); // optional
    }

    private async deposit(req: express.Request, res: express.Response) {
        // db.tables.user_profile.update()
    }

    private async getUser(req: express.Request, res: express.Response) {

    }

    private async getHistory(req: express.Request, res: express.Response) {

    }

    private async getOperation(req: express.Request, res: express.Response) {

    }
}


