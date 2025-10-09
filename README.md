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

## API

### validate

```typescript
validate.object(shape: Record<string, BaseSchema<any>>): ObjectSchema<Shape>
validate.string(): StringSchema
validate.number(): NumberSchema
```

(better documentation to come)

## License
MIT