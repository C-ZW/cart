Cart
---

# Tables
![](https://i.imgur.com/mlQoRAg.png)

# API

|Mehtod|url|description|
-|-|-|
| POST | /api/login | login
| POST | /api/register | register|
| POST | /api/user | get user profile
| POST | /api/user/history | query user shopping record
| POST | /api/user/deposit | deposit credit to user account
| POST | /api/cart | get current products in cart
| POST | /api/cart/product | add product to cart
| DELETE | /api/cart/product | delete product in cart
| POST | /api/cart/checkout | checkout products in cart


## POST /api/login
* login and update last_login_time

request
```javascript
{
    account: string,
    password: string
}
```

Response 
```javascript
{
    user_id: string,
    name: string
}
```

## POST /api/register
register account

request
```javascript
{
    account: string,
    password: string,
    name: string,
    credit: number
}
```

Response *None*

# POST /api/user/history
Get user order history

request
```javascript
{
    user_id: string
}
```

Response
```javascript
{
    account: string,
    name: string,
    order_list: array [
        {
            order_no: string,
            item_list: array [
                item_name: string,
                item_price: number,
                amount: number
            ],
            created_time: unix_timestamp,
            subtotal: number
        }
    ]
}
```

# POST /api/user/deposit
Deposit credit to user account

Request
```javascript
{
    user_id: string,
    amount: number
}
```

Response
{
    user_id: string,
    name: string
}

# POST /api/user
Get user profile

Request
```javscript
{
    account: string
}
```

Response
```javascript
{
    account: string,
    name: string,
    credit: number,
    created_time: string,
    last_login_time: unix_timestamp
}
```

# POST /api/cart/product
Add product to user cart

Request
```javascript
{
    user_id: string,
    item_id: string,
    amount: string
}
```

Response *None*

# DELETE /api/cart/product
Delete the item in user cart

Request
```javascript
{
    user_id: string,
    item_id: string
}
```

Response *None*


# POST /api/cart/checkout
Cart checkout 

Request
```javascript
{
    user_id: string
}
```

Response *None*

# POST /api/cart
Get user cart item detail

Request
```javascript
{
    user_id: string
}
```

Response
```javascript
{
    total: number,
    item_list: array [
        {
            item_id: string,
            item_name: string,
            item_price: number,
            amount: number,
            create_time: unix_time,
            subtotal: number
        }
    ]
}
```