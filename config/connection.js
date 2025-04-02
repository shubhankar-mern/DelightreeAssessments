const  Database  = require('./database');


async function startServer(){
    try {
        const database = new Database().getInstance();
        await database.connect();
        console.log('Server started successfully');
        const db = database.getDb();
        return db;
        
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

module.exports = {
    startServer
}