const { User, ChatRoom, Message, Contact, UserChat } = require('../models/user.cjs');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  // Create some users
  const user1 = await User.create({
    username: 'user1',
    password: bcrypt.hashSync('Password1!', 10),
  });

  const user2 = await User.create({
    username: 'user2',
    password: bcrypt.hashSync('Password2!', 10),
  });

  // Create a chat room
  const chatRoom = await ChatRoom.create({
    name: 'chatRoom1',
  });

  // Create a message
  await Message.create({
    chatRoomId: chatRoom.id,
    userId: user1.id,
    message: 'Hello, world!',
  });

  // Create a contact
  await Contact.create({
    userId: user1.id,
    contactId: user2.id,
  });

  // Create a user chat
  await UserChat.create({
    userId: user1.id,
    chatRoomId: chatRoom.id,
  });
}

seedDatabase().catch(console.error);