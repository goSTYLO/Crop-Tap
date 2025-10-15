module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending','paid','confirmed','in_transit','delivered','cancelled'),
      defaultValue: 'pending'
    },
    payment_status: {
      type: DataTypes.ENUM('unpaid','paid','failed'),
      defaultValue: 'unpaid'
    },
    shipping_method: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    delivery_status: {
      type: DataTypes.ENUM('pending','in_transit','delivered'),
      defaultValue: 'pending'
    },
    estimated_delivery: {
      type: DataTypes.DATE,
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
    tableName: 'orders',
    timestamps: false
  });

  Order.associate = models => {
    Order.belongsTo(models.User, { foreignKey: 'buyer_id' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    Order.hasOne(models.Payment, { foreignKey: 'order_id' });
  };

  return Order;
};