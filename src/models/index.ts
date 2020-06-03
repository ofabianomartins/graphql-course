import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';

import { DbConnection } from '../interfaces/DbConnectionInterface';

const basename: string = path.basename(module.filename);
const env: string = process.env.NODE_ENV || 'development';
let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
let db = null;

if (!db) {

    db = {};

    const operatorsAliases = false;

    config = Object.assign({operatorsAliases}, config);

    const sequelize: Sequelize.Sequelize = new Sequelize(
        process.env.DATABASE    || "graphql_blog_development",
        process.env.DB_USER     || "root",
        process.env.DB_PASSWORD || "1234",
        {
            username: process.env.DB_USER     || "root",
            password: process.env.DB_PASSWORD || "1234",
            database: process.env.DATABASE    || "graphql_blog_development",
            host: process.env.DB_HOST  || "127.0.0.1",
            dialect: "mysql",
            operatorsAliases: false
        }
    );

    fs
        .readdirSync(__dirname)
        .filter((file: string) => {
            const fileSlice: string = file.slice(-3);
            return (file.indexOf('.') !== 0) && (file !== basename) && ((fileSlice === '.js') || (fileSlice === '.ts'));
        })
        .forEach((file: string) => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model['name']] = model;
        });

    Object.keys(db).forEach((modelName: string) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db['sequelize'] = sequelize;

}

export default <DbConnection>db;