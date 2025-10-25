import type { BaseSchema, SchemaDef } from "./base.js";
import type { ObjectSchema } from "./object.js";
import type { StringSchemaDef } from "./string.js";
import type { NumberSchemaDef } from "./number.js";

/**
 * Converts a schema to a GraphQL SDL (Schema Definition Language) string.
 * 
 * @example
 * const userSchema = validate.object({
 *   name: validate.string().min(1),
 *   age: validate.number().int()
 * });
 * const sdl = toGraphQLSDL(userSchema, 'User');
 * // type User {
 * //   name: String!
 * //   age: Int!
 * // }
 */
export function toGraphQLSDL(
  schema: BaseSchema<any>,
  typeName: string
): string {
  const def = schema._def;

  if (def.type === 'object') {
    return objectToGraphQLSDL(def, typeName);
  }

  throw new Error(`Cannot convert schema type '${def.type}' to GraphQL SDL. Only object schemas are supported.`);
}

/**
 * Converts a schema definition to a GraphQL type string.
 * 
 * @example
 * const nameSchema = validate.string().min(1);
 * const type = schemaDefToGraphQLType(nameSchema._def);
 * // "String!"
 */
export function schemaDefToGraphQLType(def: SchemaDef): string {
  switch (def.type) {
    case 'string': {
      const stringDef = def as StringSchemaDef;
      const baseType = 'String';
      const nullable = stringDef.nullable || stringDef.optional;
      return nullable ? baseType : `${baseType}!`;
    }

    case 'number': {
      const numberDef = def as NumberSchemaDef;
      const baseType = numberDef.isInt ? 'Int' : 'Float';
      return `${baseType}!`;
    }

    case 'object': {
      // For nested objects, we'd need to generate a separate type
      // For now, return a placeholder
      return 'JSON';
    }

    default:
      return 'String';
  }
}

/**
 * Converts an object schema to GraphQL SDL.
 */
function objectToGraphQLSDL(def: SchemaDef, typeName: string): string {
  if (def.type !== 'object' || !def.shape) {
    throw new Error('Invalid object schema definition');
  }

  const fields: string[] = [];

  for (const [fieldName, fieldSchema] of Object.entries(def.shape)) {
    const schema = fieldSchema as BaseSchema<any>;
    const fieldType = schemaDefToGraphQLType(schema._def);
    fields.push(`  ${fieldName}: ${fieldType}`);
  }

  return `type ${typeName} {\n${fields.join('\n')}\n}`;
}

/**
 * Converts a schema to a GraphQL type configuration object (for use with graphql-js).
 * 
 * @example
 * const userSchema = validate.object({
 *   name: validate.string(),
 *   age: validate.number().int()
 * });
 * const typeConfig = toGraphQLTypeConfig(userSchema, 'User');
 */
export function toGraphQLTypeConfig(
  schema: BaseSchema<any>,
  typeName: string
): {
  name: string;
  fields: Record<string, { type: string; description?: string }>;
} {
  const def = schema._def;

  if (def.type !== 'object' || !def.shape) {
    throw new Error('Only object schemas can be converted to GraphQL type configs');
  }

  const fields: Record<string, { type: string; description?: string }> = {};

  for (const [fieldName, fieldSchema] of Object.entries(def.shape)) {
    const schema = fieldSchema as BaseSchema<any>;
    fields[fieldName] = {
      type: schemaDefToGraphQLType(schema._def),
    };
  }

  return {
    name: typeName,
    fields,
  };
}

/**
 * Generates a complete GraphQL schema SDL from multiple object schemas.
 * 
 * @example
 * const schemas = {
 *   User: validate.object({
 *     name: validate.string(),
 *     age: validate.number().int()
 *   }),
 *   Post: validate.object({
 *     title: validate.string(),
 *     content: validate.string()
 *   })
 * };
 * const sdl = generateGraphQLSchema(schemas);
 */
export function generateGraphQLSchema(
  schemas: Record<string, BaseSchema<any>>
): string {
  const types: string[] = [];

  for (const [typeName, schema] of Object.entries(schemas)) {
    types.push(toGraphQLSDL(schema, typeName));
  }

  return types.join('\n\n');
}