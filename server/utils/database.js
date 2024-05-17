import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export default class DatabaseAPI {
    constructor() {
      this.init();
    }
  
    async init() {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'chatroom'
      });
    }

  async getChatRooms(userId) {
    const [rows] = await this.connection.execute('SELECT * FROM chat_rooms WHERE user_id = ?', [userId]);
    return rows;
  }

  async getMessages(chatRoomId) {
    const [rows] = await this.connection.execute('SELECT * FROM messages WHERE chat_room_id = ?', [chatRoomId]);
    return rows;
  }

  async getUsers() {
    const [rows] = await this.connection.execute('SELECT * FROM users');
    return rows;
  }

  async addUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const [result] = await this.connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    
    return result.insertId; 
}

  async sendMessage(chatRoomId, userId, message) {
    const [result] = await this.connection.execute('INSERT INTO messages (chat_room_id, user_id, message) VALUES (?, ?, ?)', [chatRoomId, userId, message]);
    return result.insertId;
  }

  async checkContact(userId, contactId) {
    const [rows] = await this.connection.execute('SELECT * FROM contacts WHERE user1Id = ? AND user2Id = ?', [userId, contactId]);
    return rows.length > 0;
  }

  async addContact(userId, contactId) {
    await this.connection.execute('INSERT INTO contacts (user1Id, user2Id) VALUES (?, ?)', [userId, contactId]);
  }

  async createChatRoom(userIds) {
    const [result] = await this.connection.execute('INSERT INTO chat_rooms (user_id) VALUES (?)', [userIds]);
    return result.insertId;
  }

  async addUserToChatRoom(userId, chatRoomId) {
    await this.connection.execute('INSERT INTO user_chat_room (user_id, chat_room_id) VALUES (?, ?)', [userId, chatRoomId]);
  }
}

async login(username, password) {
    try {
      const [users] = await this.pool.execute('SELECT * FROM users WHERE username = ?', [username]);
      const user = users[0];

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