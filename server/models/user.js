const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Initialize Sequelize
const sequelize = new Sequelize('chatroom', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define User model
class User extends Model {
    // This is a method that we can call on a User instance to check if the provided password hashes to the stored password hash
    async validPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    set(value) {
        const hash = bcrypt.hashSync(value, saltRounds);
      this.setDataValue('password', bcrypt.hashSync(value, saltRounds));
    }
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, saltRounds);
    },
    beforeUpdate: async (user) => {
        if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, saltRounds);
            }
        },
    },
});

// Define Message model
class Message extends Model {}

Message.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages',
});

Message.belongsTo(User, { foreignKey: 'user_id' });

// Define Contact model
class Contact extends Model {}

Contact.init({
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
  },
  contact_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
  },
}, {
  sequelize,
  modelName: 'Contact',
  tableName: 'contacts',
});

Contact.belongsTo(User, { as: 'User', foreignKey: 'user_id' });
Contact.belongsTo(User, { as: 'Contact', foreignKey: 'contact_id' });

model.exports = { User, Message, Contact };