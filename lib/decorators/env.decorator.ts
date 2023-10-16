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

type EnvVarDecoratorOptions<T = any> = {
  defaultValue?: T | (() => T);
  expose?: boolean;
  removeTrailingSlash?: boolean;
  parseJson?: boolean;
};

const defaultOptions: EnvVarDecoratorOptions = {
  defaultValue: undefined,
  expose: false,
  removeTrailingSlash: false,
  parseJson: false,
};

export function Env<T>(
  key: string,
  options: EnvVarDecoratorOptions<T> = defaultOptions,
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
      exposed: options?.expose || false,
      parseJson: options?.parseJson || false,
    });

    // use default value if provided or sanitize
    const sanitized = sanitizeEnvVar<T>(
      env[key],
      options.parseJson ? 'JSON' : type.name,
      options?.removeTrailingSlash,
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
  value: string,
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
