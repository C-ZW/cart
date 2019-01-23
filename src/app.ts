import * as express from 'express';
import * as bodyParser from 'body-parser';
import User from './route/user';
import Cart from './route/cart';
import Register from './route/register';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/api', new Register().router);
app.use('/api', new User().router);
app.use('/api', new Cart().router);

export default app;