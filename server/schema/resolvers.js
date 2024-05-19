// Import the necessary modules
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import DatabaseAPI from '../utils/database.js';

const database = new DatabaseAPI();

// Define the number of salt rounds
const saltRounds = 10;

// Define the resolvers
export const resolvers = {
    Query: {
        // resolver for getting chat rooms of a user
      getChatRooms: async (_, { userId }) => {
        //call the getChatRooms method of the database API
        return await database.getChatRooms(userId);
      },
        // resolver for getting messages of a chat room
      getMessages: async (_, { chatRoomId }) => {
        //call the getMessages method of the database API
        return await database.getMessages(chatRoomId);
      },
        // resolver for getting all of the users
        getUsers: async () => {
            return await database.getUsers();
          },
        },
    Mutation: {
        // resolver for adding a user
      addUser: async (_, { username, password }) => {
        //call the addUser method of the database API
        return await database.addUser(username, password);
      },
        // resolver for sending a message
        sendMessage: async (_, { chatRoomId, userId, message }) => {
            //call the sendMessage method of the database API
            return await database.sendMessage(chatRoomId, userId, message);
        },
        // resolver for adding a contact
        addContact: async (_, { user1Id, user2Id }) => {
            //check if the contact already exists
            const contactExists = await database.checkContact(user1Id, user2Id);
            if (contactExists) {
                //throw an error if the contact already exists
                throw new Error('Contact already exists');
            }
            //call the addContact method of the database API
            await database.addContact(user1Id, user2Id);
            //create a chat room for the users
            const chatRoomId = await database.createChatRoom([user1Id, user2Id]);
            //add the users to the chat room
            await database.addUserToChatRoom(user1Id, chatRoomId);
            await database.addUserToChatRoom(user2Id, chatRoomId);
            return true;
        },
        // resolver for adding a contact
      login: async (_, { username, password }) => {
        //call the login method of the database API
        const user = await database.login(username, password);

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
        return token;
      },
    },
    };