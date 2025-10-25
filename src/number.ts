import type { SchemaType } from "./base.js";
import { BaseSchema } from "./base.js";

/**
 * Number validation schema.
 * 
 * @example
 * const schema = validate.string().min(3);
 * const result = schema.parse("hello");
 */
export type NumberSchemaDef = {
  type: 'number';
  min?: number;
  max?: number;
  isInt: boolean;
};

export class NumberSchema extends BaseSchema<number> {
  _def: NumberSchemaDef = {
    type: 'number',
    isInt: false
  };
  private _default?: number;
  private _optional: boolean = false;

  /**
   * Ensures the number is at least `n`
   */
  min(min: number): this {
    this._def.min = min;
    return this;
  }

  /**
   * Ensures the number is at most `n`
   */
  max(max: number): this {
    this._def.max = max;
    return this;
  }

  /**
   * Requires the number to be an integer
   */
  int(): this {
    this._def.isInt = true;
    return this;
  }

  /**
   * Sets a default number used when the input is `undefined`.
   */
  default(value: number): this {
    this._default = value;
    return this;
  }

  /**
   * Makes the number optional (allows `undefined`).
   */
  optional(): this {
    this._optional = true;
    return this;
  }

  parse(value: unknown): { success: true; data: number } | { success: false; errors: string[] } {
    if (value === undefined && this._default !== undefined) {
      return { success: true, data: this._default };
    }
    if (value === undefined && this._optional) {
      return { success: true, data: undefined as any };
    }
    if (typeof value !== "number") {
      return { success: false, errors: ["Not a number"] };
    }

    const errors: string[] = [];

    if (this._def.min !== undefined && value < this._def.min) {
      errors.push(`Number must be at least ${this._def.min}`);
    }

    if (this._def.max !== undefined && value > this._def.max) {
      errors.push(`Number must be at most ${this._def.max}`);
    }

    if (this._def.isInt && !Number.isInteger(value)) {
      errors.push("Number not integer");
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data: value };
  }
}