export function sanitizeString(
  value: string | undefined,
  removeTrailingSlash: boolean,
): string | undefined {
  if (removeTrailingSlash && value && value.endsWith('/')) {
    return value.slice(0, -1);
  }
  return value;
}

export function sanitizeNumber(value: string | undefined): number {
  return Number(value);
}

export function sanitizeBoolean(value: string | undefined): boolean {
  return value === 'true';
}

export function sanitizeJson(value: any): any {
  return typeof value === 'string' ? JSON.parse(value) : value;
}

export function sanitizeArray(
  value: string | undefined,
  delimiter: string,
): string[] {
  if (value === undefined) return [];
  return value.split(delimiter).map((v) => v.trim());
}
