import * as express from 'express';
import * as bodyParser from 'body-parser';
import User from './route/user';
import Cart from './route/cart';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/api', new User().router);
app.use('/api', new Cart().router);


const PORT = 8000;

app.listen(PORT, () => {
    console.log("Server start: " + PORT);
});