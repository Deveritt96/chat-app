import { Sequelize, DataTypes } from 'sequelize';
const sequelize = new Sequelize('chatroom', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      is: {
        args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        msg: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number',
      }
    }
  },
  profile_picture: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'https://i.sstatic.net/l60Hf.png',
  }
}, {
  tableName: 'users',
});

const ChatRoom = sequelize.define('ChatRoom', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  contactId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  }
}, {
  tableName: 'chat_rooms',
});

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  chatRoomId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'chat_rooms',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
},
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  tableName: 'messages',
});

const Contact = sequelize.define('Contact', {
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  contactId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  user1Id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
},
  user2Id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  tableName: 'contacts',
});

const UserChat = sequelize.define('UserChat', {
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  chatRoomId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'chat_rooms',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'user_chats',
});

// Define the relationships
Contact.belongsTo(User, { as: 'user1', foreignKey: 'user1Id' });
Contact.belongsTo(User, { as: 'user2', foreignKey: 'user2Id' });
User.hasMany(Contact, { foreignKey: 'user1Id' });
User.hasMany(Contact, { foreignKey: 'user2Id' });

ChatRoom.belongsTo(Contact, { foreignKey: 'contactId' });
Contact.hasOne(ChatRoom, { foreignKey: 'contactId' });

Message.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Message, { foreignKey: 'userId' });

Message.belongsTo(ChatRoom, { foreignKey: 'chatRoomId' });
ChatRoom.hasMany(Message, { foreignKey: 'chatRoomId' });

export { User, ChatRoom, Message, Contact};