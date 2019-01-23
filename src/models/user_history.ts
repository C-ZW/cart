/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {user_historyInstance, user_historyAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<user_historyInstance, user_historyAttribute>('user_history', {
    cart_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    created_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'user_history'
  });
};
