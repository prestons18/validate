import { validate, toGraphQLSDL, generateGraphQLSchema } from "../src/index.js";

// Example 1: Simple User schema
const userSchema = validate.object({
  id: validate.number().int(),
  name: validate.string().min(1),
  email: validate.string(),
  age: validate.number().int().optional(),
});

console.log("=== User Schema ===");
console.log(toGraphQLSDL(userSchema, "User"));
console.log();

// Example 2: Post schema
const postSchema = validate.object({
  id: validate.number().int(),
  title: validate.string().min(1),
  content: validate.string(),
  authorId: validate.number().int(),
  published: validate.number().int(), // Ideally should be boolean, that's the next feature I'll add
});

console.log("=== Post Schema ===");
console.log(toGraphQLSDL(postSchema, "Post"));
console.log();

// Example 3: Generate complete schema
const schemas = {
  User: userSchema,
  Post: postSchema,
  Comment: validate.object({
    id: validate.number().int(),
    text: validate.string(),
    postId: validate.number().int(),
    userId: validate.number().int(),
  }),
};

console.log("=== Complete GraphQL Schema ===");
console.log(generateGraphQLSchema(schemas));
console.log();

// Example 4: Introspect schema definition
console.log("=== Schema Introspection ===");
console.log("User schema definition:");
console.log(JSON.stringify(userSchema._def, null, 2));