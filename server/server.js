import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mysql from 'mysql2/promise';
import typeDefs from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import * as socketIO from 'socket.io';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';


const PORT = process.env.PORT || 4000; // use the PORT environment variable, or 4000 if it's not set
const app = express();

// Create a new Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
(async () => {
  await server.start();
  server.applyMiddleware({ app });
  app.listen({ port: PORT }, () =>
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
})();