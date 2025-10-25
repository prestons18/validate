import type { SchemaType } from "./base.js";
import { BaseSchema } from "./base.js";

/**
 * Boolean validation schema.
 * 
 * @example
 * const schema = validate.boolean();
 * const result = schema.parse(true);
 */
export type BooleanSchemaDef = {
  type: 'boolean';
  optional: boolean;
  nullable: boolean;
};

export class BooleanSchema extends BaseSchema<boolean> {
  _def: BooleanSchemaDef = {
    type: 'boolean',
    optional: false,
    nullable: false
  };
  private _default?: boolean;

  /**
   * Sets a default boolean used when the input is `undefined`.
   */
  default(value: boolean) {
    this._default = value;
    return this;
  }

  /**
   * Makes the boolean optional (allows `undefined`).
   */
  optional() {
    this._def.optional = true;
    return this;
  }

  /**
   * Makes the boolean nullable (allows `null`).
   */
  nullable() {
    this._def.nullable = true;
    return this;
  }

  parse(value: unknown): { success: true; data: boolean } | { success: false; errors: string[] } {
    if (value === undefined && this._default !== undefined) {
      return { success: true, data: this._default };
    }
    if (value === undefined && this._def.optional) {
      return { success: true, data: undefined as any };
    }
    if (value === null && this._def.nullable) {
      return { success: true, data: null as any };
    }
    if (typeof value !== "boolean") {
      return { success: false, errors: ["Not a boolean"] };
    }
    
    return { success: true, data: value };
  }
}
