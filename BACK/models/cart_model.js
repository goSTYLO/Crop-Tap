module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    farmer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
      // 🔥 Foreign key constraint removed — no `references` block
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
    tableName: 'carts',
    timestamps: false
  });

  Cart.associate = models => {
    Cart.belongsTo(models.User, { foreignKey: 'buyer_id' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id' });
  };

  return Cart;
};