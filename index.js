const express = require('express');
const cors = require('cors');
const { startServer } = require('./config/connection');
const { createHandler } = require('graphql-http/lib/use/express');
const { ruruHTML } = require('ruru/server');
const { schema, rootResolver } = require('./schema/index');
const { populateDatabase } = require('./services/index');
const app = express();

app.use(cors());

(async () => {
    
    const db = await startServer();
    // uncomment this to populate the database with data
   // await populateDatabase(db);
})();

app.get('/', (_req, res) => {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }));
  });

app.all('/graphql',createHandler({schema,rootValue: rootResolver,graphiql: true}))



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;