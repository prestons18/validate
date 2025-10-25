import type { SchemaType } from "./base.js";
import { BaseSchema } from "./base.js";

/**
 * Enum validation schema.
 * 
 * @example
 * const schema = validate.enum(['active', 'inactive', 'pending']);
 * const result = schema.parse('active');
 */
export type EnumSchemaDef = {
  type: 'enum';
  options: readonly string[];
  optional: boolean;
  nullable: boolean;
};

export class EnumSchema<T extends readonly string[]> extends BaseSchema<T[number]> {
  _def: EnumSchemaDef;
  private _default?: T[number];

  constructor(options: T) {
    super();
    this._def = {
      type: 'enum',
      options,
      optional: false,
      nullable: false
    };
  }

  /**
   * Sets a default value used when the input is `undefined`.
   */
  default(value: T[number]) {
    this._default = value;
    return this;
  }

  /**
   * Makes the enum optional (allows `undefined`).
   */
  optional() {
    this._def.optional = true;
    return this;
  }

  /**
   * Makes the enum nullable (allows `null`).
   */
  nullable() {
    this._def.nullable = true;
    return this;
  }

  parse(value: unknown): { success: true; data: T[number] } | { success: false; errors: string[] } {
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
    if (!this._def.options.includes(value)) {
      return { 
        success: false, 
        errors: [`Value must be one of: ${this._def.options.join(', ')}`] 
      };
    }
    
    return { success: true, data: value as T[number] };
  }
}
