// tslint:disable
import * as Sequelize from 'sequelize';


// table: user
export interface userAttribute {
  id:Sequelize.DataTypeUUIDv4;
  account:string;
  password:string;
}
export interface userInstance extends Sequelize.Instance<userAttribute>, userAttribute { }
export interface userModel extends Sequelize.Model<userInstance, userAttribute> { }

// table: product
export interface productAttribute {
  id:Sequelize.DataTypeUUIDv4;
  name:string;
  stock:number;
  price:number;
}
export interface productInstance extends Sequelize.Instance<productAttribute>, productAttribute { }
export interface productModel extends Sequelize.Model<productInstance, productAttribute> { }

// table: user_profile
export interface user_profileAttribute {
  user_id:Sequelize.DataTypeUUIDv4;
  name:string;
  credit:number;
  created_time:any;
  last_login_time:any;
}
export interface user_profileInstance extends Sequelize.Instance<user_profileAttribute>, user_profileAttribute { }
export interface user_profileModel extends Sequelize.Model<user_profileInstance, user_profileAttribute> { }

// table: cart
export interface cartAttribute {
  id:Sequelize.DataTypeUUIDv4;
  product_id:Sequelize.DataTypeUUIDv4;
  amount:number;
  state:string;
  created_time:any;
}
export interface cartInstance extends Sequelize.Instance<cartAttribute>, cartAttribute { }
export interface cartModel extends Sequelize.Model<cartInstance, cartAttribute> { }

// table: user_history
export interface user_historyAttribute {
  cart_id:Sequelize.DataTypeUUIDv4;
  user_id:Sequelize.DataTypeUUIDv4;
  created_time:any;
  last_update_time:any;
  state?:string;
}
export interface user_historyInstance extends Sequelize.Instance<user_historyAttribute>, user_historyAttribute { }
export interface user_historyModel extends Sequelize.Model<user_historyInstance, user_historyAttribute> { }
