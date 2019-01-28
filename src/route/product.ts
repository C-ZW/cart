import * as express from 'express';

import db from '../db/pgdb';


export default class Product {
    public router = express.Router();

    constructor() {
        this.router.get('/product', this.getProduct);
    }

    private async getProduct(req: express.Request, res: express.Response) {
        return db.tables.product.findAll({
            raw: true
        })
            .then(result => {
                res.send(result);
            }).catch(err => {
                res.status(500).send('something wrong')
            });
    }
}