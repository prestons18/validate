/**
 * Base class for all schemas
 */
export abstract class BaseSchema<T> {
  abstract parse(value: unknown): { success: true; data: T } | { success: false; errors: string[] };
}