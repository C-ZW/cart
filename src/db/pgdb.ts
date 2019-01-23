import * as Sequelize from 'sequelize';
import * as dbTables from './models/db.tables';
import config from './config';

const sequelize = new Sequelize(
    config.database,
    config.userName,
    config.password,
    config.dbConfig
);

export default {
    sequelize,
    tables: dbTables.getModels(sequelize)
};