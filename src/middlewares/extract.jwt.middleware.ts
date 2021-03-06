import * as jwt from 'jsonwebtoken'
import { RequestHandler, NextFunction, Request, Response } from "express";

import db from './../models'
import { JWT_SECRET } from '../utils/utils';

export const extractJwtMiddleware = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    let authorization: string = req.get('authorization') // Bearer <token>
    let token: string = authorization ? authorization.split(' ')[1] : undefined 
    req['context'] = {}
    req['context']['authorization'] = authorization
    if (!token) return next()

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
      if (err) return next()

      db.User.findById(decoded.sub,{
        attributes: ['id', 'email']
      }).then((user) => {
        if ( user ) {
          req['context']['authUser'] = {
            id: user.get('id'),
            email: user.get('email')
          }
        }
      })
    })
  }
}