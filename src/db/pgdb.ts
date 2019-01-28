import * as Sequelize from 'sequelize';
import * as dbTables from './models/db.tables';
import config from './config';

const sequelize = new Sequelize(
    config.database,
    config.userName,
    config.password,
    config.dbConfig
);

sequelize.options.define.underscored = true;

let tables = dbTables.getModels(sequelize);
tables.user.hasOne(tables.user_profile);
tables.user.hasMany(tables.user_history);

tables.user_history.belongsTo(tables.user);
tables.user_history.hasMany(tables.cart, {
    foreignKey: 'id'
});

tables.cart.belongsTo(tables.user_history, {
    foreignKey: 'id'
});

tables.cart.belongsTo(tables.product, {
    foreignKey: 'product_id'
});

tables.product.hasMany(tables.cart, {
    foreignKey: 'id'
});

export default {
    sequelize,
    tables: dbTables.getModels(sequelize)
};