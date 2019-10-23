const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('./config/config.json');

let db = {};
let sequelize = new Sequelize(config['development'].database,
                            config['development'].login,
                            config['development'].pwd,
                            {
                                host: config['development'].host,
                                dialect: 'mssql',
                                dialectOptions: {
                                    encrypt: true
                                }
                            } );

fs
    .readdirSync(__dirname)
    .filter(file => (file.indexOf(".") !== 0) && (file !== 'index.js'))
    .forEach(file => {
        let model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;                            