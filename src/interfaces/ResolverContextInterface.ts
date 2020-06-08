import { AuthUser } from "./AuthUserIntefaces";
import { DbConnection } from "./DbConnectionInterface";
import { DataLoaders } from "./DataLoadersInteface";
import { RequestedFields } from "../graphql/ast/RequestedFields";

export interface ResolverContext {
  db?: DbConnection;
  authorization?: string;
  authUser?: AuthUser
  dataLoaders?: DataLoaders
  requestedFields?: RequestedFields
}
