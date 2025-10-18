# @prestonarnold/validate

A lightweight, type-safe validation library for TypeScript.

## Installation

```bash
npm install @prestonarnold/validate
```
OR
```bash
yarn add @prestonarnold/validate
```

## Usage

```typescript
import { validate } from '@prestonarnold/validate';

const userSchema = validate.object({
  name: validate.string().min(1),
  age: validate.number().min(0).int()
});

const result = userSchema.parse({ name: "Preston", age: 16 });
if (result.success) {
  console.log(result.data);  // { name: "Preston", age: 16 }
}

```
## Defaults

```typescript
import { validate } from '@prestonarnold/validate';

const schema = validate.object({
  name: validate.string().min(1).default("John"),
  age: validate.number().min(0).int().default(50)
});

const res = schema.parse({});
// { success: true, data: { name: "John", age: 50 } }

```

## API

```typescript
validate.object(shape: Record<string, BaseSchema<any>>): ObjectSchema<Shape>
validate.string(): StringSchema
validate.number(): NumberSchema
```

## License
MIT
