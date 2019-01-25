import * as express from 'express';
import db from '../db/pgdb';
import { isUndefined } from 'util';
const state = require('./config/state');

export default class User {
    public router = express.Router();

    constructor() {
        this.router.post('/user/history', this.getHistory); // required
        this.router.post('/user/deposit', this.deposit); // optional
        this.router.post('/user', this.getUser); // optional
        this.router.post('/user/operation', this.getOperation); // optional
    }

    private async deposit(req: express.Request, res: express.Response) {
        if (isUndefined(req.body) ||
            isUndefined(req.body.user_id) ||
            isUndefined(req.body.amount)) {
            res.status(400).send('Bad Request');
            return;
        }

        db.tables.user_profile.findOne({
            where: {
                user_id: req.body.user_id
            }
        }).then(user => {
            user.increment('credit', { by: req.body.amount });
            res.json({
                user_id: user.user_id,
                name: user.name
            });
        }).catch(err => {
            res.status(500).send('somthing worng');
        });
    }

    private async getUser(req: express.Request, res: express.Response) {
        if (isUndefined(req.body) || isUndefined(req.body.account)) {
            res.status(400).send('Bad Request');
        }

        db.tables.user.findOne({
            where: {
                account: req.body.account
            },
            include: [{
                model: db.tables.user_profile,
                required: true
            }]
        }).then(user => {
            res.json(profileTemplate(user));
        }).catch(err => {
            res.status(500).send();
        });
    }

    private async getHistory(req: express.Request, res: express.Response) {
        db.sequelize.query(`
            SELECT
                "user_history"."cart_id" as "order_no",
                "user"."account",
                "user_profile"."name",
                "cart"."id" AS "cart_id",
                "cart"."amount",
                "cart"."state",
                "cart"."created_time",
                "product"."name" as "item_name",
                "product"."price" as "item_price",
                "product"."price" * "cart"."amount" as "subtotal"
            FROM
                "user_history"
            INNER JOIN "user" AS "user" ON "user_history"."user_id" = "user"."id"
            INNER JOIN "user_profile" ON "user"."id" = "user_profile"."user_id"
            INNER JOIN "cart" ON "user_history"."cart_id" = "cart"."id"
            INNER JOIN "product" ON "cart"."product_id" = "product"."id"
            WHERE "user_history"."user_id" = ?
            AND "cart"."state" = ?;`, {
                raw: true,
                replacements: [req.body.user_id, state.default.checkout]
            })
            .then(result => {
                res.json(orderTemplate(result[0]))
            })
            .catch(err => {
                res.status(500).send('something wrong')
            })
    }

    private async getOperation(req: express.Request, res: express.Response) {

    }
}


function profileTemplate(user) {
    return {
        account: user.account,
        name: user.user_profile.name,
        credit: user.user_profile.credit,
        created_time: user.user_profile.created_time,
        last_login_time: user.user_profile.last_login_time
    }
}

function orderTemplate(orders) {
    if (orders.length === 0) {
        return {};
    }
    let result = {};
    result['account'] = orders[0].account;
    result['name'] = orders[0].name;
    result['order_list'] = [];

    let orderSet = new Map();

    for (let item of orders) {
        let tempList;
        if (!orderSet.has(item.order_no)) {
            tempList = {};
            orderSet.set(item.order_no, tempList);
            tempList['order_no'] = item.order_no;
            tempList['created_time'] = item.created_time;
            tempList['subtotal'] = 0;
            tempList['item_list'] = [];
        } else {
            tempList = orderSet.get(item.order_no);
        }

        tempList['item_list'].push({
            item_name: item.item_name,
            item_price: item.item_price,
            amount: item.amount
        });

        tempList.subtotal += Number.parseInt(item.subtotal);
    }

    orderSet.forEach((value, key) => {
        result['order_list'].push(value)
    })

    return result;
}
