import { StringSchema } from "./string.js";
import { NumberSchema } from "./number.js";
import { ObjectSchema } from "./object.js";
import { BaseSchema } from "./base.js";

/**
 * Factory functions for creating validation schemas.
 * 
 * @example
 * const schema = validate.object({
 *   email: validate.string().min(5),
 *   age: validate.number().int()
 * });
 */
export const validate = {
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
  object: <S extends Record<string, BaseSchema<any>>>(shape: S) =>
    new ObjectSchema(shape),
};

/**
 * Extracts the type from a schema.
 * 
 * @example
 * const schema = validate.object({ name: validate.string() });
 * type User = Infer<typeof schema>; // { name: string }
 */
export type Infer<S> =
  S extends ObjectSchema<infer Shape>
  ? { [K in keyof Shape]: Infer<Shape[K]> }
  : S extends BaseSchema<infer U>
  ? U
  : never;

export { StringSchema } from "./string.js";
export { NumberSchema } from "./number.js";
export { ObjectSchema } from "./object.js";
export { BaseSchema } from "./base.js";
export type { SchemaDef, SchemaType } from "./base.js";
export type { StringSchemaDef } from "./string.js";
export type { NumberSchemaDef } from "./number.js";

export {
  toGraphQLSDL,
  toGraphQLTypeConfig,
  schemaDefToGraphQLType,
  generateGraphQLSchema,
} from "./graphql.js";