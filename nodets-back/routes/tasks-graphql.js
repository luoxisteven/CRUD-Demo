// routes/tasks.js - Main router file
const express = require('express');
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');

// Set up GraphQL endpoint
router.use('/', graphqlHTTP({
  schema,
  graphiql: true
}));

module.exports = router;