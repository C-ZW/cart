// tslint:disable
import * as path from 'path';
import * as sequelize from 'sequelize';
import * as def from './db';

export interface ITables {
  user:def.userModel;
  product:def.productModel;
  user_profile:def.user_profileModel;
  cart:def.cartModel;
  user_history:def.user_historyModel;
}

export const getModels = function(seq:sequelize.Sequelize):ITables {
  const tables:ITables = {
    user: seq.import(path.join(__dirname, './user')),
    product: seq.import(path.join(__dirname, './product')),
    user_profile: seq.import(path.join(__dirname, './user_profile')),
    cart: seq.import(path.join(__dirname, './cart')),
    user_history: seq.import(path.join(__dirname, './user_history')),
  };
  return tables;
};
