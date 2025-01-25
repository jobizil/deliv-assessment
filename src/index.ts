import { ApolloServer } from 'apollo-server';
import { resolvers } from './resolvers';
import { readFileSync } from 'fs';
import path from 'path';

const typeDefs = readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
