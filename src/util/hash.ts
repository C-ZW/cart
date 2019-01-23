import * as crypto from 'crypto';
import config from '../config';

let key = config.key;

export default function (str) {
    let hash = crypto.createHmac('sha256', key)
        .update(str)
        .digest('hex')

    return hash;
}