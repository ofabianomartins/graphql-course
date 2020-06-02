import { makeExecutableSchema } from 'graphql-tools'

const users: any[] = [
  {
    id: 1,
    name: 'John',
    email: 'john@email.com'
  },
  {
    id: 2,
    name: 'Dany',
    email: 'danny@email.com'
  }
]

const typeDefs = `
  type User {
    id: ID!
    name:  String!
    email: String!
    sign: String
  }

  type Query {
    allUsers: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }
`

const resolvers = {
  User: {
    sign: (user: any) => `${user.name} <${user.email}>`
  },
  Query: {
    allUsers: () => users
  },
  Mutation: {
    createUser: (parent: any ,args: any)  => {
      const newUser = Object.assign({ id: users.length + 1}, args)
      users.push(newUser)
      return newUser
    }
  }
}

export default makeExecutableSchema({typeDefs, resolvers});