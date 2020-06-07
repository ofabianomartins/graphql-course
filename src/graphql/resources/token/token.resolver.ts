import * as jwt from 'jsonwebtoken'

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { JWT_SECRET } from '../../../utils/utils';
import { UserInstance } from '../../../models/UserModel';

export const tokenResolvers = { 

  Mutation: {
    createToken: (parent, {email, password}, { db }:{ db:DbConnection }) => {
      return db.User.findOne({
        where: { email },
        attributes: ['id','password']

      }).then((user: UserInstance) => {
        let errorMessage: string = "Unauthorized, wrong email or password!"
        if(!user) throw new Error(errorMessage);
        if(!user.isPassword(user.get('password'), password)) throw new Error(errorMessage);

        const payload = { sub: user.get('id')}         

        return {
          token: jwt.sign(payload, JWT_SECRET)
        }
      })
    }
  }

}