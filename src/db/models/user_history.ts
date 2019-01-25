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
    },
    last_update_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.fn('now')
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'user_history'
  });
};
