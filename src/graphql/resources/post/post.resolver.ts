import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { Transaction } from "sequelize";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { INPUT_OBJECT_TYPE_DEFINITION } from "graphql/language/kinds";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";


export const postResolvers = {
  Post: {
    author: (post: PostInstance, {id}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      return db.User.findById(post.get('id')).catch(handleError)
    },
    comments: (post: PostInstance, {first = 10, offset = 0}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      return db.Comment.findAll({
        where: { post: post.get('id') },
        limit: first,
        offset
      })
      .catch(handleError)
    },
  },
  Query: {
    posts: (parent, {first = 10, offset = 0}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      return db.Post.findAll({
        limit: first,
        offset
      })
      .catch(handleError)
    },
    post: (parent, {id}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      id = parseInt(id)
      return db.Post.findById(id)
        .then((post) => {
            if(post) throw new Error(`Post with id ${id} not found`)
            return post

        })
        .catch(handleError)
    }
  },
  Mutation: {

    createPost: compose(...authResolvers)((parent, {input}, { db, authUser }: ResolverContext, info: GraphQLResolveInfo) => { 
      input.author = authUser.id
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Post.create(input, {transaction})
      })
      .catch(handleError)
    }),
    updatePost: compose(...authResolvers)((parent, {id, input}, { db, authUser }: ResolverContext, info: GraphQLResolveInfo) => { 
      id = parseInt(id)
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Post.findById(id)
          .then((post: PostInstance) => {
            throwError(!post,`Post with id ${id} not found!`)
            throwError(post.get('author') != authUser.id,`Unauthorized! You can only edit posts by yourself`)
            return post.update(input, { transaction })
          })
      })
      .catch(handleError)
    }),
    deletePost: compose(...authResolvers)((parent, {id}, { db, authUser }: ResolverContext, info: GraphQLResolveInfo) => { 
      id = parseInt(id)
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Post.findById(id)
          .then((post: PostInstance) => {
            throwError(!post,`Post with id ${id} not found!`)
            throwError(post.get('author') != authUser.id,`Unauthorized! You can only delete posts by yourself`)
            return post.destroy({ transaction })
          })
      })
      .catch(handleError)
    })
  }

}
  