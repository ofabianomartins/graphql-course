import { db } from '../../test-utils'

describe('User', () => {

  beforeEach(() => {
    return db.Comment.destroy({ where: { }})
      .then((rows:number) => db.Post.destroy({ where: {}}))
      .then((rows:number) => db.User.destroy({ where: {}}))
      .then((rows:number) => db.User.create({
        name: "Peter Quill",
        email: "peter@qurdians.com",
        password: "1234"
      }))
  })

  describe("Queries", () => {
    describe('application/json', () => {
      describe('users', () => {
        it('expect to return a list of Users', () => {
          let body = {
            query: `
              query {
                users {
                  name
                  email
                }
              }
            `
          }
        })

      })
    })
  })
})