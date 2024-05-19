import { Sequelize } from 'sequelize';
import { User, ChatRoom, Message, Contact } from '../models/user.js';
import bcrypt from 'bcrypt';

export default class DatabaseAPI {
    constructor() {
      this.init();
    }
  
    async init() {
      this.sequelize = new Sequelize(process.env.DB_NAME || 'chatroom', process.env.DB_USER || 'root', process.env.DB_PASSWORD, {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
      });
    }

    async getChatRooms(userId) {
        return await ChatRoom.findAll({ where: { userId } });
      }

      async getMessages(chatRoomId) {
        return await Message.findAll({ where: { chatRoomId } });
      }

      async getUsers() {
        return await User.findAll();
      }

      async addUser(username, password) {
        console.log(`Validating password: ${password}`);
        const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$');
        const isValid = password.match(regex);
        console.log(`Validation result: ${isValid}`);
        
        if (!isValid) {
          throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number');
        }
      
        const user = await User.create({
          username,
          password
        });
      
        return user; // return the entire user object
      }

        async sendMessage(chatRoomId, userId, message) {
        const messageCreate = await Message.create({
          chatRoomId,
          userId,
          message
        });
    }

    async checkContact(userId, contactId) {
        const contact = await Contact.findOne({
          where: {
            user1Id: userId,
            user2Id: contactId
          }
        });
      
        return contact !== null;
      }

  async addContact(userId, contactId) {
    await Contact.create({
      user1Id: userId,
      user2Id: contactId
    });
  }

  async createChatRoom(user1Id, user2Id) {
    const chatRoom = await ChatRoom.create({
      user1Id,
      user2Id
    });
  
    return chatRoom.id;
  }

  async addUserToChatRoom(userId, chatRoomId) {
    const chatRoom = await ChatRoom.findByPk(chatRoomId);
  
    if (!chatRoom.user1Id) {
      chatRoom.user1Id = userId;
    } else if (!chatRoom.user2Id) {
      chatRoom.user2Id = userId;
    } else {
      throw new Error('Chat room is already full');
    }
  
    await chatRoom.save();
  }

  async login(username, password) {
    try {
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        throw new Error('Incorrect login credentials');
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        throw new Error('Incorrect login credentials');
      }
  
      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to login');
    }
}
}