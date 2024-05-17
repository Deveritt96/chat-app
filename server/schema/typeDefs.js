import { gql } from 'apollo-server-express';



const typeDefs= gql`type User {
    id: Int!
    username: String!
}

type ChatRoom {
    id: Int!
    name: String
    users: [User]
    messages: [Message]
}

type Message {
    id: Int!
    user: User!
    message: String!
    timestamp: String!
}

type Query {
    getContacts(user_id: Int!): [User]
    getMessages(user_id: Int!, contact_id: Int!): [Message]
    getChatRooms(user_id: Int!): [ChatRoom]
    getUsers: [User]
}

type Mutation {
    sendMessage(user_id: Int!, contact_id: Int!, message: String!): Message
    addContact(user_id: Int!, contact_id: Int!): User
    addUser(username: String!, password: String!): User
}`;

export default typeDefs;