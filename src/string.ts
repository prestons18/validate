import { BaseSchema } from "./base.js";

/**
 * String validation schema.
 * 
 * @example
 * const schema = validate.string().min(3);
 * const result = schema.parse("hello");
 */
export class StringSchema extends BaseSchema<string> {
  private _min?: number;
  private _default?: string;

  /**
   * Sets minimum string length
   */
  min(n: number) { 
    this._min = n; 
    return this; 
  }

  /**
   * Sets a default string used when the input is `undefined`.
   */
  default(value: string) {
    this._default = value;
    return this;
  }

  parse(value: unknown): { success: true; data: string } | { success: false; errors: string[] } {
    if (value === undefined && this._default !== undefined) {
      return { success: true, data: this._default };
    }
    if (typeof value !== "string") {
      return { success: false, errors: ["Not a string"] };
    }
    
    if (this._min !== undefined && value.length < this._min) {
      return { success: false, errors: [`String length < ${this._min}`] };
    }
    
    return { success: true, data: value };
  }
}