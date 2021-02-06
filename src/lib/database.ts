
import MongoClient from 'mongodb';
import chalk from 'chalk';

class Database {
    async init(){
        const MONGO_DB = process.env.DATABASE || 'mongodb://localhost:2707/cycliture-user';
        const client = await MongoClient.connect(
            MONGO_DB,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        const db = client.db();

        if(client.isConnected()) {
            console.log('DATABASE CONNECTED');
            console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
        }

        return db;
    }
}

export default Database;