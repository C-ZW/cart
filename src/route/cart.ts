import * as express from 'express';

export default class Cart {
    public router = express.Router();

    constructor() {
        this.router.post('/cart/product', this.addProduct); // required
        this.router.post('/cart/checkout', this.checkout); // required
        this.router.post('/cart', this.getCart); // optional
        this.router.delete('/cart/product', this.removeProduct); // optional
    }

    private async addProduct(req: express.Request, res: express.Response) {

    }

    private async checkout(req: express.Request, res: express.Response) {

    }

    private async getCart(req: express.Request, res: express.Response) {

    }

    private async removeProduct(req: express.Request, res: express.Response) {

    }
}