import mysql from 'mysql2/promise';

export default class DatabaseAPI {
    constructor() {
      this.init();
    }
  
    async init() {
      this.connection = await mysql.createConnection(process.env.CLEARDB_DATABASE_URL || {
        host: 'localhost',
        user: 'root',
        password: 'Jimin199',
        database: 'chatroom'
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

  async addUser(username, hashedPassword) {
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