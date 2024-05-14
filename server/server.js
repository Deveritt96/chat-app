const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mysql = require('mysql2/promise');
const PORT = 4000;
const app = express();

const server = new ApolloServer({ typedefs, resolvers });

app.listen({ port: 4000 }, async () => { PORT }, async () => console.log('Server ready at http://localhost:4000' ));