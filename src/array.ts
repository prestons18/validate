import type { SchemaType } from "./base.js";
import { BaseSchema } from "./base.js";

/**
 * Array validation schema.
 * 
 * @example
 * const schema = validate.array(validate.string());
 * const result = schema.parse(['hello', 'world']);
 */
export type ArraySchemaDef = {
  type: 'array';
  items: BaseSchema<any>;
  optional: boolean;
  nullable: boolean;
  min?: number;
  max?: number;
};

export class ArraySchema<T> extends BaseSchema<T[]> {
  _def: ArraySchemaDef;
  private _default?: T[];

  constructor(items: BaseSchema<T>) {
    super();
    this._def = {
      type: 'array',
      items,
      optional: false,
      nullable: false
    };
  }

  /**
   * Sets minimum array length
   */
  min(n: number) {
    this._def.min = n;
    return this;
  }

  /**
   * Sets maximum array length
   */
  max(n: number) {
    this._def.max = n;
    return this;
  }

  /**
   * Sets a default array used when the input is `undefined`.
   */
  default(value: T[]) {
    this._default = value;
    return this;
  }

  /**
   * Makes the array optional (allows `undefined`).
   */
  optional() {
    this._def.optional = true;
    return this;
  }

  /**
   * Makes the array nullable (allows `null`).
   */
  nullable() {
    this._def.nullable = true;
    return this;
  }

  parse(value: unknown): { success: true; data: T[] } | { success: false; errors: string[] } {
    if (value === undefined && this._default !== undefined) {
      return { success: true, data: this._default };
    }
    if (value === undefined && this._def.optional) {
      return { success: true, data: undefined as any };
    }
    if (value === null && this._def.nullable) {
      return { success: true, data: null as any };
    }
    if (!Array.isArray(value)) {
      return { success: false, errors: ["Not an array"] };
    }

    const errors: string[] = [];

    if (this._def.min !== undefined && value.length < this._def.min) {
      errors.push(`Array must have at least ${this._def.min} items`);
    }

    if (this._def.max !== undefined && value.length > this._def.max) {
      errors.push(`Array must have at most ${this._def.max} items`);
    }

    // Validate each item
    const validatedItems: T[] = [];
    for (let i = 0; i < value.length; i++) {
      const result = this._def.items.parse(value[i]);
      if (!result.success) {
        errors.push(`Item at index ${i}: ${result.errors.join(', ')}`);
      } else {
        validatedItems.push(result.data);
      }
    }

    return errors.length > 0 
      ? { success: false, errors } 
      : { success: true, data: validatedItems };
  }
}
