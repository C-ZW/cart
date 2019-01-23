/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {cartInstance, cartAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<cartInstance, cartAttribute>('cart', {
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user_history',
        key: 'cart_id'
      }
    },
    product_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: '0'
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'cart'
  });
};
