/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adoptions from "../adoptions.js";
import type * as applications from "../applications.js";
import type * as partners from "../partners.js";
import type * as pets from "../pets.js";
import type * as popups from "../popups.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as travels from "../travels.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adoptions: typeof adoptions;
  applications: typeof applications;
  partners: typeof partners;
  pets: typeof pets;
  popups: typeof popups;
  seed: typeof seed;
  settings: typeof settings;
  travels: typeof travels;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
