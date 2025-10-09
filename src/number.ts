import { BaseSchema } from "./base.js";

/**
 * Number validation schema.
 * 
 * @example
 * const schema = validate.string().min(3);
 * const result = schema.parse("hello");
 */
export class NumberSchema extends BaseSchema<number> {
  private _min?: number;
  private _int?: boolean;

  /**
   * Ensures the number is at least `n`
   */
  min(n: number) {
    this._min = n;
    return this;
  }

  /**
   * Requires the number to be an integer
   */
  int() {
    this._int = true;
    return this;
  }

  parse(value: unknown): { success: true; data: number } | { success: false; errors: string[] } {
    if (typeof value !== "number") {
      return { success: false, errors: ["Not a number"] };
    }

    if (this._min !== undefined && value < this._min) {
      return { success: false, errors: [`Number < ${this._min}`] };
    }

    if (this._int && !Number.isInteger(value)) {
      return { success: false, errors: ["Number not integer"] };
    }

    return { success: true, data: value };
  }
}