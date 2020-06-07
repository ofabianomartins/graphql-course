import { AuthUser } from "./AuthUserIntefaces";
import { DbConnection } from "./DbConnectionInterface";

export interface ResolverContext {
  db?: DbConnection;
  authorization?: string;
  authUser?: AuthUser
}
