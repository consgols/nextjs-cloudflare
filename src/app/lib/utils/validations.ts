//Robust value validator that accepts anything
export function isValueValid(value: unknown): boolean {
  if (value == null) return false; // null or undefined

  if (Array.isArray(value)) return value.length > 0;

  if (typeof value === 'string') return value.trim().length > 0;

  // Numbers/booleans/objects are considered "present" by default.
  // Adjust if you want different rules.
  return true;
}

//Check specific fields on an object
export function areObjectFieldsValid<T extends object>(obj: T | null | undefined, fields: (keyof T)[]): boolean {
  if (!obj) return false;
  return fields.every(field => isValueValid(obj[field]));
}
