import { PostModel, PostInstance } from "../../models/PostModel";
import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";

export class PostLoader {

  static async batchPosts(
    Post: PostModel, 
    params: DataLoaderParam<number>[],
    requestedFields: RequestedFields
  ): Promise<PostInstance[]> {
    let ids: number[] = params.map(param => param.key)

    const posts = await Promise.resolve(
      Post.findAll({
        where: { id: { $in: ids } },
        attributes: requestedFields.getFields(param[0].info, {
          keep: ['id'], exclude: ['comments']
        })
      })
    )
    
    const postsMap = posts.reduce(
      (prev, post) => ({
        ...prev,
        [post.id]: post,
      }),
      {},
    )

    return ids.map(id => postsMap[id])
  }
}