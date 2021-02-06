import { IContext } from './interfaces/contex.interface';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import environments from './config/environments';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import chalk from 'chalk';


if(process.env.NODE_ENV !='production'){
  const env = environments;
  console.log(env);
  
}

async function init () {
  const app = express();

  app.use('*', cors());
  
  app.use(compression());
  
  const database = new Database();

  const db = await database.init();

  const context = async({req, connection}:IContext) => {
    const token = (req) ? req.headers.token : connection.authorization;
    return {db, token};
  };

  const server = new ApolloServer({
    schema,
    introspection: true,
    context
  });

  server.applyMiddleware({
    app
  });

  app.get('/', expressPlayground({
    endpoint: '/graphql'
  }));
  
  const httpServer = createServer(app);
  const PORT = process.env.PORT || 27017;

  httpServer.listen(
    {
      port: PORT
    },
    () => {
      console.log('==================SERVER API GRAPHQL====================');
      console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
      console.log(`MESSAGE: ${chalk.greenBright('API FLOWTU - Online Shop CONNECT!!')}`);
      console.log(`GraphQL Server => @: http://localhost:${PORT}/graphql `);
      console.log(`WS Connection => @: ws://localhost:${PORT}/graphql `);
    }
  )
}

init();