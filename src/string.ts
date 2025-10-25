import type { SchemaType } from "./base.js";
import { BaseSchema } from "./base.js";

/**
 * String validation schema.
 * 
 * @example
 * const schema = validate.string().min(3);
 * const result = schema.parse("hello");
 */
export type StringSchemaDef = {
  type: 'string';
  min?: number;
  optional: boolean;
  nullable: boolean;
};

export class StringSchema extends BaseSchema<string> {
  _def: StringSchemaDef = {
    type: 'string',
    optional: false,
    nullable: false
  };
  private _default?: string;

  /**
   * Sets minimum string length
   */
  min(n: number) { 
    this._def.min = n; 
    return this; 
  }

  /**
   * Sets a default string used when the input is `undefined`.
   */
  default(value: string) {
    this._default = value;
    return this;
  }

  /**
   * Makes the string optional (allows `undefined`).
   */
  optional() {
    this._def.optional = true;
    return this;
  }

  /**
   * Makes the string nullable (allows `null`).
   */
  nullable() {
    this._def.nullable = true;
    return this;
  }

  parse(value: unknown): { success: true; data: string } | { success: false; errors: string[] } {
    if (value === undefined && this._default !== undefined) {
      return { success: true, data: this._default };
    }
    if (value === undefined && this._def.optional) {
      return { success: true, data: undefined as any };
    }
    if (value === null && this._def.nullable) {
      return { success: true, data: null as any };
    }
    if (typeof value !== "string") {
      return { success: false, errors: ["Not a string"] };
    }

    const errors: string[] = [];

    if (this._def.min !== undefined && value.length < this._def.min) {
      errors.push(`String must be at least ${this._def.min} characters`);
    }
    
    return errors.length > 0 ? { success: false, errors } : { success: true, data: value };
  }
}