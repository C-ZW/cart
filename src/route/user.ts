import * as express from 'express';
import tables from '../db/pgdb';

export default class User {
    public router = express.Router();

    constructor() {
        this.router.post('/login', this.login); // required
        this.router.post('/history', this.getHistory); // required
        this.router.post('/register', this.register); // optional
        this.router.put('/deposit ', this.deposit); // optional
        this.router.post('/user', this.getUser); // optional
        this.router.post('/user/operation', this.getUser); // optional
    }

    private async login(req: express.Request, res: express.Response) {

    }

    private async register(req: express.Request, res: express.Response) {

    }

    private async deposit(req: express.Request, res: express.Response) {

    }

    private async getUser(req: express.Request, res: express.Response) {

    }

    private async getHistory(req: express.Request, res: express.Response) {

    }
}

