import * as express from 'express';
import tables from '../db/pgdb';

export default class Register {
    public router = express.Router();

    constructor() {
        this.router.post('/register', this.register); // optional
    }

    private async register(req: express.Request, res: express.Response) {

    }
}