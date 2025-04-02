const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';

const dbName = 'sales';
class Database{
    constructor(){
        this.client = new MongoClient(url);
        this.db = this.client.db(dbName);
    }
    async connect(){
        await this.client.connect();
        console.log('Connected successfully to server');
    }
    async disconnect(){
        await this.client.close();
        console.log('Disconnected successfully from server');
    }
    getDb(){
       

        return this.db;
    }
    
}
class Singleton {
    constructor(){
        if(!Singleton.instance){
            Singleton.instance = new Database();

        }
    }
    getInstance(){
        return Singleton.instance
    }
}



module.exports =  Singleton;