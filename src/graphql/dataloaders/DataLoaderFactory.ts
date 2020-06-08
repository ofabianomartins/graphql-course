import * as DataLoader from 'dataloader'

import { DbConnection } from "../../interfaces/DbConnectionInterface";
import { DataLoaders } from '../../interfaces/DataLoadersInteface'
import { UserInstance } from '../../models/UserModel';
import { UserLoader } from './UserLoader';
import { PostInstance } from '../../models/PostModel';
import { PostLoader } from './PostLoader';
import { RequestedFields } from '../ast/RequestedFields';
import { DataLoaderParam } from '../../interfaces/DataLoaderParamInterface';


export class DataLoaderFactory {

  constructor (
    private db: DbConnection,
    private requestedFields: RequestedFields
  ) {}

  getLoaders(): DataLoaders {
    return {
      userLoader: new DataLoader<DataLoaderParam<number>,UserInstance>(
        (params: DataLoaderParam<number>[]) => UserLoader.batchUsers(this.db.User, params, {
          cacheKeyFn: (param: DataLoaderParam<number>) => param.key
        })
        
      ),
      postLoader: new DataLoader<DataLoaderParam<number>,PostInstance>(
        (params: DataLoaderParam<number>[]) => PostLoader.batchPosts(this.db.Post, params, {
          cacheKeyFn: (param: DataLoaderParam<number>) => param.key
        })
        
      )
    }

  }
}