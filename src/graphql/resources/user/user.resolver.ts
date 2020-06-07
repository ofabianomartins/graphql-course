import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModel";
import { Transaction } from "sequelize";
import { handleError, throwError } from "../../../utils/utils";

import { authResolver, authResolvers } from "../../composable/auth.resolver";
import { AuthUser } from '../../../interfaces/AuthUserIntefaces'
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";
import { compose } from "../../composable/composable.resolver";
import { verifyTokenResolver } from "../../composable/verify-token.resolver";


export const userResolvers = {
  User: {
    posts: (user: UserInstance, {first = 10, offset = 0}, { db }: ResolverContext, info: GraphQLResolveInfo) => { 
      return db.Post.findAll({
        where: { author: user.get('id')},
        limit: first,
        offset
      })
      .catch(handleError)
    }
  },

  Query: {
    users: (parent, {first = 10, offset = 0}, { db }: ResolverContext, info: GraphQLResolveInfo) => {
      return db.User.findAll({
        limit: first,
        offset: offset
      })
      .catch(handleError)
    },
    user: (parent, {id }, { db }: ResolverContext, info: GraphQLResolveInfo) => {
      id = parseInt(id)
      return db.User.findById(id)
        .then((user:UserInstance) => {
          if(!user) throw new Error(`User with ${id} not found!`)
          return user
        })
        .catch(handleError)
    },
    currentUser: (parent,args, { db, authUser }:ResolverContext, info: GraphQLResolveInfo) => {
      return db.User.findById(authUser.id)
        .then((user:UserInstance) => {
          throwError(!user,`User with ${authUser.id} not found!`)
          return user
        })
        .catch(handleError)
    }
  },
  Mutation: {
    createUser: (parent, { input }, { db }: ResolverContext, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.User.create(input, { transaction: t})
      })
      .catch(handleError)
    },
    updateUser: compose(...authResolvers)((parent, {input}, {db, authUser}: ResolverContext, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((transaction: Transaction) => {
        return db.User.findById(authUser.id)
          .then((user: UserInstance) => {
            if(!user) throw new Error(`User with ${authUser.id} not found!`)
            return user.update(input, { transaction })
          })
      })
      .catch(handleError)
    }),
    updateUserPassword: compose(...authResolvers)((parent, {input}, {db, authUser}: ResolverContext, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.User
          .findById(authUser.id)
          .then((user:UserInstance) => {
            if(!user) throw new Error(`User with ${authUser.id}} not found!`)
            return user.update(input, { transaction: t })
              .then((user: UserInstance) => !!user)
          })
      })
      .catch(handleError)
    }),
    deleteUser: compose(...authResolvers)((parent, args, {db, authUser}:ResolverContext, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.User
          .findById(authUser.id)
          .then((user:UserInstance) => {
            if(!user) throw new Error(`User with ${authUser.id} not found!`)
            return user.destroy({ transaction: t })
          })
      })
      .catch(handleError)
    })
  }
}