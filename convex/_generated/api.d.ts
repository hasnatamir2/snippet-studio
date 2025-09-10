/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_stripe from "../actions/stripe.js";
import type * as mutations_snippet from "../mutations/snippet.js";
import type * as mutations_users from "../mutations/users.js";
import type * as queries_snippets from "../queries/snippets.js";
import type * as queries_user from "../queries/user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/stripe": typeof actions_stripe;
  "mutations/snippet": typeof mutations_snippet;
  "mutations/users": typeof mutations_users;
  "queries/snippets": typeof queries_snippets;
  "queries/user": typeof queries_user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
