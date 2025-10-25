import type { Infer } from "./index.js";
import type { SchemaType } from "./base.js";
import { BaseSchema } from "./base.js";

/**
 * Schema for validating objects with a specific shape.
 * 
 * @example
 * const userSchema = validate.object({
 *   name: validate.string().min(1),
 *   age: validate.number().int()
 * });
 */
export class ObjectSchema<Shape extends Record<string, BaseSchema<any>>> 
  extends BaseSchema<{ [K in keyof Shape]: Infer<Shape[K]> }> {
  
  _def: {
    type: SchemaType;
    shape: Shape;
  };

  constructor(shape: Shape) { 
    super();
    this._def = {
      type: 'object',
      shape
    };
  }

  parse(value: unknown): 
    | { success: true; data: { [K in keyof Shape]: Infer<Shape[K]> } } 
    | { success: false; errors: string[] } 
  {
    if (typeof value !== "object" || value === null) {
      return { success: false, errors: ["Not an object"] };
    }

    const errors: string[] = [];
    const data: any = {};

    for (const key in this._def.shape) {
      const field = this._def.shape[key];
      const val = (value as any)[key];
      const res = field.parse(val);
      
      if (!res.success) {
        errors.push(...res.errors.map((e: string) => `${key}: ${e}`));
      } else {
        data[key] = res.data;
      }
    }

    if (errors.length) {
      return { success: false, errors };
    }
    
    return { success: true, data };
  }
}