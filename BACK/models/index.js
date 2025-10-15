const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ✅ Use configured instance only

const db = {};
const basename = path.basename(__filename);

// Dynamically import all *_model.js files
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('_model.js') && file !== basename)
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;