// Import the necessary modules
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server-express';

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
        //call the getUsers method of the database API
        return await dataSources.database.getUsers();
      },
    },
    Mutation: {
        // resolver for adding a user
      addUser: async (_, { username, password }, { dataSources }) => {
        //hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        //call the addUser method of the database API
        return await dataSources.database.addUser(username, hashedPassword);
      },
        // resolver for sending a message
      sendMessage: async (_, { chatRoomId, userId, message }, { dataSources }) => {
        //call the sendMessage method of the database API
        return await dataSources.database.sendMessage(chatRoomId, userId, message);
      },
        // resolver for getting contacts of a user
      addContact: async (_, { userId, contactId }, { dataSources }) => {
        //check if the contact already exists
        const contactExists = await dataSources.database.checkContact(userId, contactId);
        //throw an error if the contact already exists
        if (contactExists) {
          throw new Error('Contact already exists');
        }
        //call the addContact method of the database API
        await dataSources.database.addContact(userId, contactId);
        //call the createChatRoom method of the database API
        const chatRoomId = await dataSources.database.createChatRoom([userId, contactId]);
        //call the addUserToChatRoom method of the database API
        await dataSources.database.addUserToChatRoom(userId, chatRoomId);
        //call the addUserToChatRoom method of the database API
        await dataSources.database.addUserToChatRoom(contactId, chatRoomId);
        return true;
      },
        // resolver for adding a contact
      login: async (_, { username, password }, { dataSources }) => {
        //call the login method of the database API
        const user = await dataSources.database.login(username, password);

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
        return token;
      },
    },
    };