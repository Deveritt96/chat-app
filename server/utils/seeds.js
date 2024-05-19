import { User, ChatRoom, Message, Contact } from '../models/user.js';

async function seedDatabase() {
    // Find and delete user if it exists, then create it
    let user1 = await User.findOne({ where: { username: 'user4' } });
    if (user1) {
      await user1.destroy();
    }
    user1 = await User.create({
      username: 'user4',
      password: 'Password1',
      profile_picture: 'https://i.sstatic.net/l60Hf.png',
    });
  
    let user2 = await User.findOne({ where: { username: 'user6' } });
    if (user2) {
      await user2.destroy();
    }
    user2 = await User.create({
      username: 'user6',
      password: 'Password2',
      profile_picture: 'https://i.sstatic.net/l60Hf.png',
    });
  
   // Create a contact
   const contact = await Contact.create({
    userId: user1.id,
    contactId: user2.id,
  }, { fields: ['userId', 'contactId',] });

  const createdContact = await Contact.findOne({ where: { userId: user1.id, contactId: user2.id } });
  
    // Create a chat room
    const chatRoom = await ChatRoom.create({
      name: 'chatRoom1',
      userId: user1.id,
      contactId: createdContact.id,
    });
  
    // Create a message
    await Message.create({
      chatRoomId: chatRoom.id,
      userId: user1.id,
      message: 'Hello, world!',
    });
  }
  
  seedDatabase();