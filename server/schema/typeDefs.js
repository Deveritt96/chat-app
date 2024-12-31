import { gql } from 'apollo-server-express';



const typeDefs= gql`type User {
    id: Int!
    username: String!
    password: String!
    profile_picture: String
    contacts: [Contact]
    messages: [Message]
}

type Contact {
    user1Id: User
    user2Id: User
    chatRoom: ChatRoom
}

type ChatRoom {
    id: Int!
    name: String
    contactId: Contact
    messages: [Message]
}

type Message {
    id: Int!
    user: User!
    chatRoom: ChatRoom!
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
    sendMessage(user_id: Int!, chatRoom_id: Int!, message: String!): Message
    addContact(user1Id: Int!, user2Id: Int!): Contact
    addUser(username: String!, password: String!): User
    login(username: String!, password: String!): User
}`

export default typeDefs;