import { Transaction } from "sequelize";
import { GraphQLResolveInfo } from "graphql";

import { CommentInstance } from "../../../models/CommentModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";

export const commentResolvers = {

  Comment: {
    user: (comment: CommentInstance, args, {db, dataLoaders}: ResolverContext, info) => {
      return dataLoaders
        .userLoader
        .load({
          key: comment.get('user'),
          info
        })
        .catch(handleError)
    },

    post: (comment: CommentInstance, args, {db, dataLoaders}: ResolverContext, info) => {
      return dataLoaders
        .postLoader
        .load({
          key: comment.get('post'),
          info
        })
        .catch(handleError) 

    }
  },
  Query: {
    commentsByPost: (parent, { postId, first = 10, offset = 0}, {db, requestedFields}:ResolverContext, info) => {
      postId = parseInt(postId)
      return db.Comment.findAll({
        where: { post: postId },
        limit: first,
        offset,
        attributes: requestedFields.getFields(info)
      })
      .catch(handleError)
    }
  },
  Mutation: {
    createComment: compose(...authResolvers)((parent, {input}, { db, authUser }: ResolverContext, info: GraphQLResolveInfo) => { 
      input.user = authUser.id
      return db.sequelize.transaction((t) => {
        return db.Comment.create(input, {transaction: t})
      })
      .catch(handleError)
    }),
    updateComment: compose(...authResolvers)((parent, {id, input}, { db, authUser }: ResolverContext, info: GraphQLResolveInfo) => { 
      id = parseInt(id)
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Comment.findById(id)
          .then((comment: CommentInstance) => {
            throwError(!comment, `Comment with id ${id} not found!`)
            throwError(comment.get('user') != authUser, `Unauthorized! You can only update comments by yourself`)
            return comment.update(input, { transaction })
          })
      })
      .catch(handleError)
    }),
    deleteComment: (parent, {id}, { db,authUser }: ResolverContext, info: GraphQLResolveInfo) => { 
      id = parseInt(id)
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Post.findById(id)
          .then((comment: CommentInstance) => {
            throwError(!comment, `Comment with id ${id} not found!`)
            throwError(comment.get('user') != authUser, `Unauthorized! You can only delete comments by yourself`)
            return comment.destroy({ transaction })
          })
      })
      .catch(handleError)
    }
  }
};
