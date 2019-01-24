import * as Sequelize from 'sequelize';
import * as dbTables from './models/db.tables';
import config from './config';

const sequelize = new Sequelize(
    config.database,
    config.userName,
    config.password,
    config.dbConfig
);

sequelize.options.define.underscored = true

let tables = dbTables.getModels(sequelize);
tables.user.hasOne(tables.user_profile);
tables.user.hasMany(tables.user_history);
tables.user_history.hasOne(tables.cart);
tables.cart.hasMany(tables.product);

export default {
    sequelize,
    tables: dbTables.getModels(sequelize)
};