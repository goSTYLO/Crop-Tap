// models/user_model.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('farmer', 'buyer', 'admin'),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = models => {
    User.hasMany(models.Product, { foreignKey: 'farmer_id' });
    User.hasMany(models.Order, { foreignKey: 'buyer_id' });
    User.hasMany(models.Payment, { foreignKey: 'order_id' }); // indirect via Order
    User.hasMany(models.OrderItem, { foreignKey: 'farmer_id' }); // denormalized
    User.hasMany(models.Cart, { foreignKey: 'buyer_id' });
  };

  return User;
};