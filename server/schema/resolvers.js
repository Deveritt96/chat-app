export const resolvers = {
    Query: {
      getChatRooms: async (_, { userId }, { dataSources }) => {
        return await dataSources.database.getChatRooms(userId);
      },
      getMessages: async (_, { chatRoomId }, { dataSources }) => {
        return await dataSources.database.getMessages(chatRoomId);
      },
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
    },
  };