import { User, ChatRoom, Message, Contact } from '../models/user';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  // Create some users
  const user1 = await User.create({
    username: 'user1',
    password: bcrypt.hashSync('Password1!', 10),
    profile_picture: 'https://i.sstatic.net/l60Hf.png',
  });

  const user2 = await User.create({
    username: 'user2',
    password: bcrypt.hashSync('Password2!', 10),
    profile_picture: 'https://i.sstatic.net/l60Hf.png',
  });

  // Create a contact
  const contact = await Contact.create({
    user1Id: user1.id,
    user2Id: user2.id,
  });

  // Create a chat room
  const chatRoom = await ChatRoom.create({
    name: 'chatRoom1',
    contactId: contact.id,
  });

  // Create a message
  await Message.create({
    chatRoomId: chatRoom.id,
    userId: user1.id,
    message: 'Hello, world!',
  });
}

seedDatabase();