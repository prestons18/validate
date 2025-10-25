import type { BaseSchema, SchemaDef } from "./base.js";
import type { NumberSchemaDef } from "./number.js";
import type { EnumSchemaDef } from "./enum.js";
import type { ArraySchemaDef } from "./array.js";

/**
 * Registry to track generated types and avoid duplicates
 */
class TypeRegistry {
  private types = new Map<string, string>();
  private nameCounter = new Map<string, number>();

  /**
   * Register a type definition
   */
  register(name: string, definition: string): void {
    this.types.set(name, definition);
  }

  /**
   * Check if a type is already registered
   */
  has(name: string): boolean {
    return this.types.has(name);
  }

  /**
   * Get all registered type definitions
   */
  getAll(): string[] {
    return Array.from(this.types.values());
  }

  /**
   * Generate a unique type name
   */
  generateUniqueName(baseName: string): string {
    const count = this.nameCounter.get(baseName) || 0;
    this.nameCounter.set(baseName, count + 1);
    return count === 0 ? baseName : `${baseName}${count}`;
  }

  /**
   * Clear all registered types
   */
  clear(): void {
    this.types.clear();
    this.nameCounter.clear();
  }
}

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
  const registry = new TypeRegistry();
  const mainType = resolveTypeWithRegistry(schema._def, typeName, registry);
  
  // Get all generated types (nested objects)
  const allTypes = registry.getAll();
  
  // Return main type plus any nested types
  return allTypes.length > 0 ? allTypes.join('\n\n') : mainType;
}

/**
 * Resolves a schema definition to a GraphQL type, registering nested objects
 */
function resolveTypeWithRegistry(
  def: SchemaDef,
  typeName: string,
  registry: TypeRegistry
): string {
  if (def.type === 'object') {
    if (!registry.has(typeName)) {
      const typeDefinition = objectToGraphQLSDL(def, typeName, registry);
      registry.register(typeName, typeDefinition);
    }
    return typeName;
  }

  throw new Error(`Cannot convert schema type '${def.type}' to GraphQL SDL. Only object schemas are supported at the root level.`);
}

/**
 * Converts a schema definition to a GraphQL type string.
 * 
 * @example
 * const nameSchema = validate.string().min(1);
 * const type = schemaDefToGraphQLType(nameSchema._def);
 * // "String!"
 */
export function schemaDefToGraphQLType(
  def: SchemaDef,
  fieldName?: string,
  registry?: TypeRegistry
): string {
  const nullable = def.nullable || def.optional;

  switch (def.type) {
    case 'string': {
      const baseType = 'String';
      return nullable ? baseType : `${baseType}!`;
    }

    case 'number': {
      const numberDef = def as NumberSchemaDef;
      const baseType = numberDef.isInt ? 'Int' : 'Float';
      return nullable ? baseType : `${baseType}!`;
    }

    case 'boolean': {
      const baseType = 'Boolean';
      return nullable ? baseType : `${baseType}!`;
    }

    case 'enum': {
      const enumDef = def as EnumSchemaDef;
      
      if (!registry) {
        // Fallback: return as string union
        return enumDef.options.map((x) => `"${x}"`).join(' | ');
      }
      
      // Generate an enum type name
      const enumTypeName = fieldName 
        ? `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}Enum`
        : registry.generateUniqueName('Enum');
      
      // Register the enum type if not already registered
      if (!registry.has(enumTypeName)) {
        const enumValues = enumDef.options.map(opt => `  ${opt.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`).join('\n');
        const enumDefinition = `enum ${enumTypeName} {\n${enumValues}\n}`;
        registry.register(enumTypeName, enumDefinition);
      }
      
      return nullable ? enumTypeName : `${enumTypeName}!`;
    }

    case 'array': {
      const arrayDef = def as ArraySchemaDef;
      const itemType = schemaDefToGraphQLType(arrayDef.items._def, fieldName, registry);
      // Remove the ! from itemType if it exists, as we'll add it back
      const cleanItemType = itemType.endsWith('!') ? itemType.slice(0, -1) : itemType;
      const baseType = `[${cleanItemType}!]`;
      return nullable ? baseType : `${baseType}!`;
    }

    case 'object': {
      if (!registry) {
        return 'JSON';
      }
      
      // Generate a type name for the nested object
      const nestedTypeName = fieldName 
        ? fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        : registry.generateUniqueName('NestedType');
      
      // Register the nested object type
      if (!registry.has(nestedTypeName)) {
        const typeDefinition = objectToGraphQLSDL(def, nestedTypeName, registry);
        registry.register(nestedTypeName, typeDefinition);
      }
      
      return nullable ? nestedTypeName : `${nestedTypeName}!`;
    }

    default:
      return 'String';
  }
}

/**
 * Converts an object schema to GraphQL SDL.
 */
function objectToGraphQLSDL(
  def: SchemaDef,
  typeName: string,
  registry: TypeRegistry
): string {
  if (def.type !== 'object' || !def.shape) {
    throw new Error('Invalid object schema definition');
  }

  const fields: string[] = [];

  for (const [fieldName, fieldSchema] of Object.entries(def.shape)) {
    const schema = fieldSchema as BaseSchema<any>;
    const fieldType = schemaDefToGraphQLType(schema._def, fieldName, registry);
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
      type: schemaDefToGraphQLType(schema._def, fieldName),
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
  const registry = new TypeRegistry();
  const types: string[] = [];

  for (const [typeName, schema] of Object.entries(schemas)) {
    resolveTypeWithRegistry(schema._def, typeName, registry);
  }

  return registry.getAll().join('\n\n');
}