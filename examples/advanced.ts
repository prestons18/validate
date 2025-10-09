/**
 * Advanced example
 * 
 * Demonstrates validation failure: throws [ 'age: Not a number' ]
 * (as per line 17)
 * 
 * NOTE: Infer usage isn't usually required, although you can use this for piece of mind.
*/

import { validate, Infer } from '../src';

const userSchema = validate.object({
    name: validate.string().min(1),
    age: validate.number().min(0).int(),
});

type User = Infer<typeof userSchema>;
// Equivalent to: { name: string; age: number }

const input = { name: "Preston", age: "16" };

const result = userSchema.parse(input);

if (result.success) {
    const user: User = result.data;
    console.log("Parsed user:", user);
} else {
    console.error("Validation failed:", result.errors);
}