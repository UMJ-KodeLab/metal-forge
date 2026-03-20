const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

let sequelize;
if (config.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.storage,
    logging: config.logging,
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
  });
}

const User = require('./User')(sequelize);
const Product = require('./Product')(sequelize);
const Genre = require('./Genre')(sequelize);
const ProductGenre = require('./ProductGenre')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Cart = require('./Cart')(sequelize);
const CartItem = require('./CartItem')(sequelize);
const Wishlist = require('./Wishlist')(sequelize);

// Associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Product.belongsToMany(Genre, { through: ProductGenre, foreignKey: 'productId', as: 'genres' });
Genre.belongsToMany(Product, { through: ProductGenre, foreignKey: 'genreId', as: 'products' });

User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Wishlist, { foreignKey: 'userId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Wishlist, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  Genre,
  ProductGenre,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Wishlist,
};
