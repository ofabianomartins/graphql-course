import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash'

import { Query } from './query'
import { Mutation } from './mutation'

import { commentResolvers } from './resources/comment/comment.resolvers';
import { postResolvers } from './resources/post/post.resolvers';
import { userResolvers } from './resources/user/user.resolvers';

import { postTypes } from './resources/post/post.schema';
import { userTypes } from './resources/user/user.schema';
import { commentTypes } from './resources/comment/comment.schema';

const SchemaDefinition = `
  type Schema {
    query: Query
    mutation: Mutation
  }
`;

const resolvers = merge(
  commentResolvers,
  postResolvers,
  
  userResolvers
);

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    Query,
    Mutation,
    postTypes,
    userTypes,
    commentTypes
  ],
  resolvers 
});