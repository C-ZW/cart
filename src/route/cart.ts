import * as express from 'express';
import db from '../db/pgdb';
import { v4 as uuid } from 'uuid';
import { DataTypeUUIDv4 } from 'sequelize';
import * as sequelize from 'sequelize';

const state = require('./config/state');

export default class Cart {
    public router = express.Router();

    constructor() {
        this.addProduct = this.addProduct.bind(this);
        this.checkout = this.checkout.bind(this);
        this.getCart = this.getCart.bind(this);
        this.addProductToCart = this.addProductToCart.bind(this);
        this.removeProduct = this.removeProduct.bind(this);
        this.removeProductFromCart = this.removeProductFromCart.bind(this);

        this.router.post('/cart/product', this.addProduct); // required
        this.router.post('/cart/checkout', this.checkout); // required
        this.router.post('/cart', this.getCart); // optional
        this.router.delete('/cart/product', this.removeProduct); // optional
    }

    /**
     * * Decrement product stock
     * * Add product to user cart
     * 
     * @param req 
     * @param res 
     */
    private async addProduct(req: express.Request, res: express.Response) {
        let userId = req.body.user_id;
        let item_id = req.body.item_id;
        let amount = req.body.amount;

        db.sequelize.transaction(async t => {
            let cart = await this.getUserCart(userId, t);
            await this.decrementStock(item_id, amount, t);
            await this.addProductToCart(item_id, cart.cart_id, amount, t);
        }).catch(err => {
            res.status(400).end();
            return;
        });

        res.end();
    }

    /**
     * Add product to cart, if product already existed, increment amount.
     * 
     * @param productId 
     * @param cartId 
     * @param amount 
     * @param t 
     */
    private async addProductToCart(productId: DataTypeUUIDv4, cartId, amount: number, t) {
        let cart = await this.getProductInCart(productId, cartId, t);
        let c_id = cart.id;

        return await db.tables.cart.findOne({
            where: {
                id: c_id
            },
            transaction: t,
            lock: t.lock
        }).then(cart => {
            cart.update({
                state: state.default.pending
            }, {
                    transaction: t
                });
            return cart;
        }).then(cart => {
            return cart.increment('amount', {
                by: amount,
                transaction: t
            })
        });
    }

    /**
     * Find the cart, product pair.
     * If none, create a new record with productId and cartId,
     * and return id.
     * 
     * @param productId 
     * @param cartId 
     * @param t 
     */
    private async getProductInCart(productId, cartId, t) {
        return db.tables.cart.findOrCreate({
            where: {
                id: cartId,
                product_id: productId
            },
            defaults: {
                id: cartId,
                product_id: productId,
                amount: 0,
                state: state.default.pending,
                created_time: new Date()
            },
            transaction: t,
            raw: true
        }).then(async result => {
            return result[0];
        });
    }

    /**
     * Get user cart which is in pending.
     * If none, create a new cart and return id
     * 
     * @param userId 
     * @param t 
     */
    private async getUserCart(userId, t = null) {
        return db.tables.user_history.findOrCreate({
            attributes: ['cart_id'],
            where: {
                user_id: userId,
                state: state.default.pending
            },
            defaults: {
                user_id: userId,
                cart_id: uuid(),
                created_time: new Date(),
                last_update_time: new Date()
            },
            transaction: t,
            lock: t.lock,
            raw: true
        }).then(result => {
            return result[0];
        })
    }

    /**
     * Decrement stock. 
     * If stock not enough, throw a "product not enough" exception.
     * 
     * @param product_id 
     * @param amount 
     * @param t 
     */
    private async decrementStock(product_id, amount, t) {
        return db.tables.product.findOne({
            where: {
                id: product_id
            },
            transaction: t,
            lock: t.lock
        }).then(product => {
            if (product.stock - amount >= 0) {
                product.decrement('stock', {
                    by: amount,
                    transaction: t
                });
            } else {
                throw new Error('stock not enough');
            }
            return product;
        })
    }

    /**
     * * Checkout all pending product in cart
     * * Decrement user credit by total price
     * * Update user history state to checkout
     * * Update cart state to checkout
     * 
     * If cart is empty, throw a "No item" exception.
     * If credit not enough, throw a "Credit not enough" exception.
     * 
     * @param req 
     * @param res 
     */
    private async checkout(req: express.Request, res: express.Response) {
        db.sequelize.transaction(async (t) => {
            let userId = req.body.user_id;
            let orders = await this.getPendingOrder(userId, t);
            let userCredit = await this.getUserCredit(userId, t);
            orders = checkoutTemplate(orders);

            if (orders.length === 0) {
                throw new Error('No item');
            }

            if (userCredit < orders['total']) {
                throw new Error('Credit not enough');
            }

            await this.userPay(userId, orders['total'], t);
            await this.updateCartState(orders.cartId, t);
            await this.updateUserHistory(orders.cartId, t);

            res.end();
        })
            .catch(err => {
                res.send('something wrong');
            });
    }

    private async getUserCredit(userId: DataTypeUUIDv4, t: sequelize.Transaction) {
        return db.sequelize.query(`
            SELECT credit FROM user_profile
            WHERE user_id = ?`, {
                transaction: t,
                replacements: [userId]
            }).then(result => {
                return result[0][0].credit;
            })
    }

    private async userPay(userId: DataTypeUUIDv4, credit: number, t) {
        return db.tables.user_profile.findOne({
            where: {
                user_id: userId
            },
            transaction: t,
            lock: t.lock
        }).then(user => {
            user.decrement('credit', {
                by: credit,
                transaction: t
            });
        })
    }

    private async updateUserHistory(cartId: DataTypeUUIDv4, t) {
        return db.tables.user_history.update({
            state: state.default.checkout,
            last_update_time: new Date()
        }, {
                where: {
                    cart_id: cartId
                },
                transaction: t
            })
    }

    private async updateCartState(cartId, t = null) {
        return db.tables.cart.update({
            state: state.default.checkout
        }, {
                where: {
                    id: cartId,
                    state: state.default.pending
                },
                transaction: t
            })
    }

    /**
     * * Get user's all pending product in cart
     * 
     * @param req 
     * @param res 
     */
    private async getCart(req: express.Request, res: express.Response) {
        try {
            let result = await this.getPendingOrder(req.body.user_id);
            res.send(getCartTemplate(result));
        } catch (err) {
            res.status(500).end();
        }
    }

    private async getPendingOrder(userId: DataTypeUUIDv4, t: sequelize.Transaction = null) {
        return db.sequelize.query(`
            SELECT cart_id as "cartId",
                cart.amount * product.price AS subtotal,
                product.name AS item_name,
                product.id AS item_id,
                cart.created_time AS create_time,
                product.price AS item_price,
                cart.amount AS amount
            FROM user_history
            INNER JOIN cart
                ON user_history.cart_id = cart.id
            INNER JOIN product
                ON cart.product_id = product.id
            where user_history.user_id = ?
            AND user_history.state = ?
        `, {
                transaction: t,
                replacements: [userId, state.default.pending]

            }).then(itemList => {
                return itemList[0];
            })
    }

    /**
     * * Restore product stock
     * * Set product in cart state to "removed"
     * 
     * @param req 
     * @param res 
     */
    private async removeProduct(req: express.Request, res: express.Response) {
        let userId = req.body.user_id;
        let itemId = req.body.item_id;

        db.sequelize.transaction(async t => {
            let userCart = await this.getUserCart(userId, t);
            await this.restoreStock(userCart.cart_id, itemId, t);
            await this.removeProductFromCart(userCart.cart_id, itemId, t)
        }).catch(err => {
            res.status(400).end();
            return;
        })

        res.end();
    }

    /**
     * Restore product stock
     * 
     * @param cartId 
     * @param productId 
     * @param t 
     */
    private async restoreStock(cartId, productId, t) {
        return db.tables.cart.findOne({
            where: {
                id: cartId,
                product_id: productId
            },
            transaction: t,
            lock: t.lock
        }).then(cart => {
            db.tables.product.findOne({
                where: {
                    id: productId
                },
                transaction: t,
                lock: t.lock
            }).then(product => {
                product.increment('stock', {
                    by: cart.amount,
                    transaction: t
                })
            })
        });
    }

    /**
     * Set state to "removed" and amount to 0.
     * 
     * @param cartId 
     * @param productId 
     * @param t 
     */
    private async removeProductFromCart(cartId, productId, t = null) {
        return db.tables.cart.update({
            state: state.default.removed,
            amount: 0
        }, {
                where: {
                    id: cartId,
                    product_id: productId
                }
            });
    }
}

function getCartTemplate(itemList) {
    let result = {};
    let items = [];

    itemList.forEach(item => {
        items.push({
            subtotal: item.subtotal,
            item_name: item.item_name,
            item_id: item.item_id,
            created_time: item.create_time,
            item_price: item.item_price,
            amount: item.amount
        })
    });

    result['item_list'] = items;
    result['total'] = items.reduce((sum, cur) => {
        return sum + Number.parseInt(cur.subtotal)
    }, 0)

    return result;
}

function checkoutTemplate(itemList) {
    let result = {};
    let items = [];
    if (itemList.length === 0) {
        return {};
    }

    result['cartId'] = itemList[0].cartId;

    itemList.forEach(item => {

        items.push({
            subtotal: item.subtotal,
            item_name: item.item_name,
            item_id: item.item_id,
            created_time: item.create_time,
            item_price: item.item_price,
            amount: item.amount
        })
    });

    result['item_list'] = items;
    result['total'] = items.reduce((sum, cur) => {
        return sum + Number.parseInt(cur.subtotal)
    }, 0)

    return result;
}