// models/products_model.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    farmer_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'products',
    timestamps: false
  });

  Product.associate = models => {
    Product.belongsTo(models.User, {
      foreignKey: 'farmer_id',
      onDelete: 'SET NULL'
    });
    Product.hasMany(models.CartItem, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };

  return Product;
};