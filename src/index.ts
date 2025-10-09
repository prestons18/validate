import { StringSchema } from "./string";
import { NumberSchema } from "./number";
import { ObjectSchema } from "./object";
import { BaseSchema } from "./base";

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

export { StringSchema } from "./string";
export { NumberSchema } from "./number";
export { ObjectSchema } from "./object";