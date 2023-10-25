export const exposedRawConfigurationValuesForDebugging = new Map<
  string,
  {
    envVar: string;
    propertyKey: string;
    rawValue: string | undefined;
    exposed: boolean;
    parseJson: boolean;
  }
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
};

const defaultOptions: EnvDecoratorOptions = {
  defaultValue: undefined,
  expose: false,
  removeTrailingSlash: false,
  parseJson: false,
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

    exposedRawConfigurationValuesForDebugging.set(key, {
      envVar: key,
      propertyKey: String(propertyKey),
      rawValue: options?.expose ? env[key] : '[HIDDEN]',
      exposed: options?.expose ?? false,
      parseJson: options?.parseJson ?? false,
    });

    // use default value if provided or sanitize
    const sanitized = sanitizeEnvVar<T>(
      env[key],
      options.parseJson ? 'JSON' : type.name,
      options?.removeTrailingSlash ?? false,
      options?.defaultValue,
    );

    Object.defineProperty(target, propertyKey, {
      get: () => sanitized,
      enumerable: true,
      configurable: true,
    });
  };
}

export const sanitizeEnvVar = <T>(
  value: string | undefined,
  typeName: string,
  removeTrailingSlash: boolean,
  defaultValue?: T | (() => T),
): T => {
  let sanitized: any;
  // use default value if provided or sanitize
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      if (typeof defaultValue === 'function') {
        sanitized = (defaultValue as () => T)();
      } else {
        sanitized = defaultValue;
      }
    } else {
      sanitized = undefined;
    }
  } else {
    switch (typeName) {
      case 'String':
        sanitized = value;
        if (removeTrailingSlash && sanitized && sanitized.endsWith('/')) {
          sanitized = sanitized.slice(0, -1);
        }
        break;
      case 'Number':
        sanitized = Number(value);
        break;
      case 'Boolean':
        sanitized = value === 'true';
        break;
      case 'JSON':
        sanitized = typeof value === 'string' ? JSON.parse(value) : value;
        break;
      default:
        sanitized = value;
    }
  }

  return sanitized;
};
