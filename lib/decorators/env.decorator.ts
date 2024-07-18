import {
  sanitizeArray,
  sanitizeBoolean,
  sanitizeJson,
  sanitizeNumber,
  sanitizeString,
} from './sanitizers';

export const exposedRawConfigurationValuesForDebugging = new Map<
  string,
  {
    envVar: string;
    propertyKey: string;
    rawValue: string;
  } & EnvDecoratorOptions
>();

type EnvDecoratorOptions<T = any> = {
  /**
   * Variable's default value, used if no other value is populated from environment. Undefined by default
   */
  defaultValue?: T | (() => T);

  /**
   * Exposing will show the value of variable in log. False by default
   */
  expose?: boolean;

  /**
   * Removes last string character, if it is a forward slash. False by default
   */
  removeTrailingSlash?: boolean;

  /**
   * Parses the value to a JavaScript object with JSON.parse. Throws on invalid input. False by default
   */
  parseJson?: boolean;

  /**
   * Parses the value to an array using `delimiter` property. Throws on invalid input. False by default
   */
  parseArray?: boolean;

  /**
   * Delimiter to be used with `parseArray: true`. `,` by default
   */
  delimiter?: string;
};

const defaultOptions: EnvDecoratorOptions = {
  defaultValue: undefined,
  expose: false,
  removeTrailingSlash: false,
  parseJson: false,
  parseArray: false,
  delimiter: ',',
};

export function Env<T>(
  /**
   * Environment variable's name
   * @example - DATABASE_URL
   */
  key: string,
  options: EnvDecoratorOptions<T> = defaultOptions,
): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const env = process.env;

    // get the type of the property
    const type = Reflect.getMetadata('design:type', target, propertyKey);

    if (options.parseJson && type.name !== 'Object') {
      throw new Error(
        `EnvVar decorator with parseJson option can only be used on properties of type Object. Property ${String(
          propertyKey,
        )} is of type ${type.name}.`,
      );
    }

    if (options.parseJson && options.parseArray) {
      throw new Error(
        `EnvVar decorator with parseJson and parseArray options cannot be used together on property ${String(
          propertyKey,
        )} of type ${type.name}.`,
      );
    }

    const sanitizedOptions = {
      expose: options?.expose ?? false,
      removeTrailingSlash: options?.removeTrailingSlash ?? false,
      parseJson: options?.parseJson ?? false,
      parseArray: options?.parseArray ?? false,
      delimiter: options?.delimiter ?? ',',
      defaultValue: options?.defaultValue,
    };

    exposedRawConfigurationValuesForDebugging.set(key, {
      envVar: key,
      propertyKey: String(propertyKey),
      rawValue: options?.expose ? env[key] ?? '' : '[HIDDEN]',
      ...sanitizedOptions,
    });

    const typeName = options.parseJson
      ? 'JSON'
      : options.parseArray
        ? 'Array'
        : type.name;

    // use default value if provided or sanitize
    const sanitized = sanitizeEnvVar<T>(env[key], typeName, sanitizedOptions);

    Object.defineProperty(target, propertyKey, {
      get: () => sanitized,
      enumerable: true,
      configurable: true,
    });
  };
}

export const sanitizeEnvVar = <T>(
  raw: string | undefined,
  typeName: string,
  options: {
    delimiter: string;
    removeTrailingSlash: boolean;
    defaultValue?: T | (() => T);
  },
): T | undefined => {
  const value = raw ?? applyDefaultValue(options.defaultValue);
  switch (typeName) {
    case 'String':
      return sanitizeString(value, options.removeTrailingSlash) as T;
    case 'Number':
      return sanitizeNumber(value) as T;
    case 'Boolean':
      return sanitizeBoolean(value) as T;
    case 'JSON':
      return sanitizeJson(value) as T;
    case 'Array':
      return sanitizeArray(value, options.delimiter) as T;
    default:
      return value;
  }
};

function applyDefaultValue<T>(defaultValue: T | (() => T) | undefined): any {
  if (defaultValue !== undefined) {
    if (typeof defaultValue === 'function') {
      return (defaultValue as () => T)();
    } else {
      return defaultValue;
    }
  } else {
    return undefined;
  }
}
