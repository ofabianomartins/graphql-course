import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstance } from "../../../models/PostModel";
import { Transaction } from "sequelize";
import { handleError } from "../../../utils/utils";


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

    createPost: (parent, {input}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Post.create(input, {transaction})
      })
      .catch(handleError)
    },
    updatePost: (parent, {id, input}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      id = parseInt(id)
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Post.findById(id)
          .then((post: PostInstance) => {
            if(!post) throw new Error(`Post with id ${id} not found!`)
            return post.update(input, { transaction })
          })
      })
      .catch(handleError)
    },
    deletePost: (parent, {id}, { db }: { db: DbConnection}, info: GraphQLResolveInfo) => { 
      id = parseInt(id)
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.Post.findById(id)
          .then((post: PostInstance) => {
            if(!post) throw new Error(`Post with id ${id} not found!`)
            return post.destroy({ transaction })
          })
      })
      .catch(handleError)
    }
  }

}
  