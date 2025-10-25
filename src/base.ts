/**
 * Base class for all schemas
 */
export type SchemaType = 'string' | 'number' | 'object' | 'unknown';

export type SchemaDef = {
  type: SchemaType;
  [key: string]: any;
};

export abstract class BaseSchema<T> {
  abstract parse(value: unknown): { success: true; data: T } | { success: false; errors: string[] };
  
  /**
   * Returns the schema definition for introspection
   */
  abstract _def: SchemaDef;
  
  /**
   * Returns the schema definition for introspection
   */
  get def() {
    return this._def;
  }
}