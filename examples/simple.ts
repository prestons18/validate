/**
 * Simple example
 */

import { validate } from '../src';

const userSchema = validate.object({
  name: validate.string().min(1).default("Preston"),
  age: validate.number().min(0).int().default(16)
});

const result = userSchema.parse({});
if (result.success) {
  console.log(result.data);  // { name: "Preston", age: 16 }
}