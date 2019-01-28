Cart
---
# Setup
* modify src/db/config
    * userName
    * password

    npm install
    
    cd sql

    psql -U username -d myDataBase -a -f schema.sql

    psql -U username -d myDataBase -a -f setup.sql

    npm run dev
    

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
| GET | /api/product | get all product


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

GET /api/product

request parameter: None

response
```javascript
{
    id: string,
    name: string,
    stock: integer,
    price: number
}
```

## implements

# Tables
![](https://i.imgur.com/mlQoRAg.png)

## product
Each entity is a product

primary key: id

attributes: name, stock, price

* relation
    * Each entity belongs to many cart
* constraint
    * stock >= 0
    * price >= 0)


## cart
Each entity is a product in user's cart

primary key: (id, product)

attribute: amount, state, created_item

* relation:
    * Each entity has one product
    * Each entity belongs to a user's user_history

* cart has three state
    * pending
    * checkout
    * removed    
* constraint
    * amount >= 0

## user_history
Each entity is someone's cart

primary key: cart_id

attribute: user_id、created_time、last_update_time

* user_history has two state
    * pending
    * checkout

* relation:
    * Each entity belongs to a user

## user
Each entity is a user

primary key: id

attribute: account, password

* relation
    * Each entity has a user_profile
    * Each entity has many user_history

* constraint
    * account is unique

## user_profile
Each entity is a user's profile

primary key: user_name

attribute: name, credit, created_time, last_login_time

* relation
    * Each entity belongs to a user

* constraint
    * credit >= 0

# Functionality

* POST /api/login
    * login
    * update last_login_time

* POST /api/register
    * register

* POST /api/user
    * get user_profile

* POST /api/history
    * get user checkout order history

* POST /api/deposit
    * deposit credit to user account

* POST /api/cart
    * get user pending cart and pending product

* POST /api/cart/product
    * add product to cart and set state to pending
        * if product is already existed, update state
    * update user_history and set state to pending
    * update the product in cart amount
        * if product is already existed, add amount
    * decrement product stock

* DELETE /api/cart/product
    * set cart state to removed, amount to 0
    * restore product stock

* POST /api/cart/checkout
    * checkout cart product
    * increment user's credit
    * update cart state to checkout
    * update user_hstory state to checkout
