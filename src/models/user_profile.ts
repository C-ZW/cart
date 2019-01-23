/* jshint indent: 2 */
// tslint:disable
import * as sequelize from 'sequelize';
import {DataTypes} from 'sequelize';
import {user_profileInstance, user_profileAttribute} from './db';

module.exports = function(sequelize: sequelize.Sequelize, DataTypes: DataTypes) {
  return sequelize.define<user_profileInstance, user_profileAttribute>('user_profile', {
    user_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credit: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: '0'
    },
    created_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    last_login_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'user_profile'
  });
};
