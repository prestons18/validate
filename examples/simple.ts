/**
 * Simple example
*/

import { validate } from '../src';

const userSchema = validate.object({
  name: validate.string().min(1),
  age: validate.number().min(0).int()
});

const result = userSchema.parse({ name: "Preston", age: 16 });
if (result.success) {
  console.log(result.data);  // { name: "Preston", age: 16 }
}