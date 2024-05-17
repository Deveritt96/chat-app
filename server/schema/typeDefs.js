type User {
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
    user_id: Int!
    message: String!
    timestamp: String!
}

type Query {
    getContacts(user_id: Int!): [User]
    getMessages(user_id: Int!, contact_id: Int!): [Message]
}

type Mutation {
    sendMessage(user_id: Int!, contact_id: Int!, message: String!): Message
    addContacts(user_id: Int!, contact_id: Int!): User
}