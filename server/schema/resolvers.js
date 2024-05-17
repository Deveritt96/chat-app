// Import the necessary modules
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';
import { LogTimings } from 'concurrently';
import bcrypt from 'bcrypt';

// Define the number of salt rounds
const saltRounds = 10;

// Define the resolvers
export const resolvers = {
    Query: {
        // resolver for getting chat rooms of a user
      getChatRooms: async (_, { userId }, { dataSources }) => {
        //call the getChatRooms method of the database API
        return await dataSources.database.getChatRooms(userId);
      },
        // resolver for getting messages of a chat room
      getMessages: async (_, { chatRoomId }, { dataSources }) => {
        //call the getMessages method of the database API
        return await dataSources.database.getMessages(chatRoomId);
      },
        // resolver for getting all of the users
      getUsers: async (_, __, { dataSources }) => {
        return await dataSources.database.getUsers();
      },
    },
    Mutation: {
      addUser: async (_, { username, password }, { dataSources }) => {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return await dataSources.database.addUser(username, hashedPassword);
      },
      sendMessage: async (_, { chatRoomId, userId, message }, { dataSources }) => {
        return await dataSources.database.sendMessage(chatRoomId, userId, message);
      },
      addContact: async (_, { userId, contactId }, { dataSources }) => {
        const contactExists = await dataSources.database.checkContact(userId, contactId);
        if (contactExists) {
          throw new Error('Contact already exists');
        }
        await dataSources.database.addContact(userId, contactId);
        const chatRoomId = await dataSources.database.createChatRoom([userId, contactId]);
        await dataSources.database.addUserToChatRoom(userId, chatRoomId);
        await dataSources.database.addUserToChatRoom(contactId, chatRoomId);
        return true;
      },
      login: async (_, { username, password }, { dataSources }) => {

        const user = await dataSources.database.login(username, password);
    
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        return token;
      },
    },
    };