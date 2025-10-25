import { validate, toGraphQLSDL, generateGraphQLSchema } from "../src/index.js";

console.log("=== GraphQL SDL Generation - Advanced Features ===\n");

// Example 1: Boolean support
const userSchema = validate.object({
  id: validate.number().int(),
  name: validate.string().min(1),
  email: validate.string(),
  isActive: validate.boolean(),
  age: validate.number().int().optional(),
});

console.log("=== User Schema (with Boolean) ===");
console.log(toGraphQLSDL(userSchema, "User"));
console.log();

// Example 2: Enum support
const postSchema = validate.object({
  id: validate.number().int(),
  title: validate.string().min(1),
  content: validate.string(),
  status: validate.enum(["draft", "published", "archived"]),
  authorId: validate.number().int(),
});

console.log("=== Post Schema (with Enum) ===");
console.log(toGraphQLSDL(postSchema, "Post"));
console.log();

// Example 3: Array support
const blogSchema = validate.object({
  id: validate.number().int(),
  title: validate.string(),
  tags: validate.array(validate.string()),
  viewCounts: validate.array(validate.number().int()),
});

console.log("=== Blog Schema (with Arrays) ===");
console.log(toGraphQLSDL(blogSchema, "Blog"));
console.log();

// Example 4: Nested objects
const authorSchema = validate.object({
  id: validate.number().int(),
  name: validate.string(),
  bio: validate.string().optional(),
});

const articleSchema = validate.object({
  id: validate.number().int(),
  title: validate.string(),
  content: validate.string(),
  author: authorSchema,
  published: validate.boolean(),
});

console.log("=== Article Schema (with Nested Object) ===");
console.log(toGraphQLSDL(articleSchema, "Article"));
console.log();

// Example 5: Complex nested structure
const addressSchema = validate.object({
  street: validate.string(),
  city: validate.string(),
  country: validate.string(),
  zipCode: validate.string().optional(),
});

const profileSchema = validate.object({
  id: validate.number().int(),
  username: validate.string().min(3),
  email: validate.string(),
  isVerified: validate.boolean(),
  role: validate.enum(["admin", "user", "moderator"]),
  addresses: validate.array(addressSchema),
  tags: validate.array(validate.string()),
  score: validate.number(),
});

console.log("=== Profile Schema (Complex Nested) ===");
console.log(toGraphQLSDL(profileSchema, "Profile"));
console.log();

// Example 6: Generate complete schema with multiple types
const completeSchemas = {
  User: validate.object({
    id: validate.number().int(),
    name: validate.string(),
    email: validate.string(),
    isActive: validate.boolean(),
    role: validate.enum(["admin", "user"]),
  }),
  Post: validate.object({
    id: validate.number().int(),
    title: validate.string(),
    content: validate.string(),
    authorId: validate.number().int(),
    tags: validate.array(validate.string()),
    published: validate.boolean(),
  }),
  Comment: validate.object({
    id: validate.number().int(),
    text: validate.string(),
    postId: validate.number().int(),
    userId: validate.number().int(),
    likes: validate.number().int(),
  }),
};

console.log("=== Complete GraphQL Schema ===");
console.log(generateGraphQLSchema(completeSchemas));
console.log();

// Example 7: Deeply nested objects
const metadataSchema = validate.object({
  createdAt: validate.string(),
  updatedAt: validate.string(),
  version: validate.number().int(),
});

const documentSchema = validate.object({
  id: validate.number().int(),
  title: validate.string(),
  content: validate.string(),
  metadata: metadataSchema,
  author: validate.object({
    id: validate.number().int(),
    name: validate.string(),
    email: validate.string(),
  }),
  tags: validate.array(validate.string()),
  isPublished: validate.boolean(),
});

console.log("=== Document Schema (Deeply Nested) ===");
console.log(toGraphQLSDL(documentSchema, "Document"));
console.log();

// Example 8: Arrays of nested objects
const productSchema = validate.object({
  id: validate.number().int(),
  name: validate.string(),
  price: validate.number(),
  inStock: validate.boolean(),
  categories: validate.array(validate.string()),
  reviews: validate.array(
    validate.object({
      id: validate.number().int(),
      rating: validate.number().int(),
      comment: validate.string(),
      userId: validate.number().int(),
    })
  ),
});

console.log("=== Product Schema (Array of Nested Objects) ===");
console.log(toGraphQLSDL(productSchema, "Product"));
console.log();
