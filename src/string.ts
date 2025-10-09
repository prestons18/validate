import { BaseSchema } from "./base";

/**
 * String validation schema.
 * 
 * @example
 * const schema = validate.string().min(3);
 * const result = schema.parse("hello");
 */
export class StringSchema extends BaseSchema<string> {
  private _min?: number;

  /**
   * Sets minimum string length
   */
  min(n: number) { 
    this._min = n; 
    return this; 
  }

  parse(value: unknown): { success: true; data: string } | { success: false; errors: string[] } {
    if (typeof value !== "string") {
      return { success: false, errors: ["Not a string"] };
    }
    
    if (this._min !== undefined && value.length < this._min) {
      return { success: false, errors: [`String length < ${this._min}`] };
    }
    
    return { success: true, data: value };
  }
}