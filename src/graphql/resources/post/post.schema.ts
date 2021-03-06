

const postTypes = `

  type Post {
    id: ID!
    title: String!
    content: String!
    photo: String!
    createdAt: String!
    updatedAt: String!
    comments: [ Comment! ]!
    author: User!
  }

  input PostInput {
    title: String!
    content: String!
    photo: String!
  }  

`

const postQueries = `
  posts(first: Int, offset: Int): [ Post! ]!
  post(id: ID!): Post
`

const postMutations = `
  createPost(input: PostInput!): Post
  updatePost(id: ID!, input: PostInput!): Post
  deletePost(id: ID!): Post
`

export {
  postTypes,
  postQueries,
  postMutations
}
