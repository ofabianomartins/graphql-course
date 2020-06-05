import { Transaction } from "sequelize";
import { GraphQLResolveInfo } from "graphql";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { CommentInstance } from "../../../models/CommentModel";
import { handleError } from "../../../utils/utils";

export const commentResolvers = {

  Comment: {
    user: (comment: CommentInstance, args, {db}: {db: DbConnection}, info) => {
      return db.User.findById(comment.get('id')).catch(handleError)
    },

    post: (comment: CommentInstance, args, {db}: {db: DbConnection}, info) => {
      return db.Post.findById(comment.get('id')).catch(handleError)
    }
  },
  Query: {
    commentsByPost: (parent, { postId, first = 10, offset = 0}, {db}:{db: DbConnection}, info) => {
      postId = parseInt(postId)
      return db.Comment.findAll({
        where: { post: postId },
        limit: first,
        offset
      })
      .catch(handleError)
    }
  },
  Mutation: {
    createComment: (parent, {input}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      return db.sequelize.transaction((t) => {
        return db.Comment.create(input, {transaction: t})
      })
      .catch(handleError)
    },
    updateComment: (parent, {id, input}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      id = parseInt(id)
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Comment.findById(id)
          .then((comment: CommentInstance) => {
            if(!comment) throw new Error(`Comment with id ${id} not found!`)
            return comment.update(input, { transaction })
          })
      })
      .catch(handleError)
    },
    deleteComment: (parent, {id}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      id = parseInt(id)
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Post.findById(id)
          .then((comment: CommentInstance) => {
            if(!comment) throw new Error(`Comment with id ${id} not found!`)
            return comment.destroy({ transaction })
          })
      })
      .catch(handleError)
    }
  }
};
