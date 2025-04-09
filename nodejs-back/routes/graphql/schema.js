
// routes/graphql/schema.js - Schema definition combining types, queries and mutations
const { 
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLID,
    GraphQLEnumType
  } = require('graphql');

  // Load environment variables and database model
  require('dotenv').config();
  const DB_TYPE = process.env.DB_TYPE || 'json';
  const { Task } = require(`../../models/index-${DB_TYPE}`);
  
  // Define GraphQL types
  const StatusEnum = new GraphQLEnumType({
    name: 'TaskStatus',
    values: {
      TODO: { value: 'To Do' },
      IN_PROGRESS: { value: 'In Progress' },
      DONE: { value: 'Done' }
    }
  });
  
  const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLID) },
      title: { type: GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      status: { type: StatusEnum },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString }
    })
  });
  
  // Root Query
  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      task: {
        type: TaskType,
        args: { id: { type: GraphQLNonNull(GraphQLID) } },
        resolve: async (_, args) => await Task.findByPk(args.id)
      },
      tasks: {
        type: new GraphQLList(TaskType),
        resolve: async () => await Task.findAll()
      }
    })
  });
  
  // Root Mutation
  const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      createTask: {
        type: TaskType,
        args: {
          title: { type: GraphQLNonNull(GraphQLString) },
          description: { type: GraphQLString },
          status: { type: StatusEnum }
        },
        resolve: async (_, args) => {
          return await Task.create({
            title: args.title,
            description: args.description,
            status: args.status || 'To Do'
          });
        }
      },
      updateTask: {
        type: TaskType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) },
          title: { type: GraphQLString },
          description: { type: GraphQLString },
          status: { type: StatusEnum }
        },
        resolve: async (_, args) => {
          const task = await Task.findByPk(args.id);
          if (!task) throw new Error('Task not found');
          
          return await task.update({
            title: args.title || task.title,
            description: args.description !== undefined ? args.description : task.description,
            status: args.status || task.status
          });
        }
      },
      deleteTask: {
        type: TaskType,
        args: { id: { type: GraphQLNonNull(GraphQLID) } },
        resolve: async (_, args) => {
          const task = await Task.findByPk(args.id);
          if (!task) throw new Error('Task not found');
          
          const deletedTask = { ...task.dataValues };
          await task.destroy();
          return deletedTask;
        }
      }
    })
  });
  
  // Create and export schema
  const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
  });
  
  module.exports = schema;