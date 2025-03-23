import { Env } from '../decorators';

class MockConfig {
  @Env('STRING_VAR')
  stringVar: string;

  @Env('STRING_WITH_TRAILING_SLASH', { removeTrailingSlash: true })
  stringWithTrailingSlash: string;

  @Env('STRING_VAR_WITH_DEFAULT_VALUE', {
    defaultValue: 'defaultValue/',
  })
  stringVarWithDefaultValue: string;

  @Env('NUMBER_VAR')
  numberVar: number;

  @Env('NUMBER_VAR_WITH_DEFAULT_VALUE', {
    defaultValue: 42,
  })
  numberVarWithDefaultValue: number;

  @Env('BOOLEAN_VAR')
  booleanVar: boolean;

  @Env('BOOLEAN_VAR_WITH_DEFAULT_VALUE', {
    defaultValue: true,
  })
  booleanVarWithDefaultValue: boolean;

  @Env('JSON_VAR', { parseJson: true })
  jsonVar: Record<string, any>;

  @Env('ARRAY_VAR', { parseArray: true })
  arrayVar: string[];

  @Env('ARRAY_WITH_CUSTOM_DELIMITER', { parseArray: true, delimiter: '|' })
  arrayWithCustomDelimiter: string[];

  @Env('ARRAY_WITH_DEFAULT_VALUE', {
    parseArray: true,
    defaultValue: ['defaultValue'],
  })
  arrayWithDefaultValue: string[];

  @Env('DEFAULT_VALUE_VAR', { defaultValue: 'default' })
  defaultValueVar: string;

  @Env('FUNCTION_DEFAULT_VALUE', { defaultValue: () => 'function default' })
  functionDefaultValue: string;
}

describe('Env decorator with sanitizers', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should sanitize string values', () => {
    process.env.STRING_VAR = 'test string';
    const config = new MockConfig();
    expect(config.stringVar).toBe('test string');
  });

  it('should remove trailing slash from string values when configured', () => {
    process.env.STRING_WITH_TRAILING_SLASH = 'test/';
    const config = new MockConfig();
    expect(config.stringWithTrailingSlash).toBe('test');
  });

  it('should use default value for string when env var is not set', () => {
    const config = new MockConfig();
    expect(config.stringVarWithDefaultValue).toBe('defaultValue/');
  });

  it('should sanitize number values', () => {
    process.env.NUMBER_VAR = '42';
    const config = new MockConfig();
    expect(config.numberVar).toBe(42);
  });

  it('should use default value for number when env var is not set', () => {
    const config = new MockConfig();
    expect(config.numberVarWithDefaultValue).toBe(42);
  });

  it('should sanitize boolean values', () => {
    process.env.BOOLEAN_VAR = 'true';
    const config = new MockConfig();
    expect(config.booleanVar).toBe(true);
  });

  it('should use default value for boolean when env var is not set', () => {
    const config = new MockConfig();
    expect(config.booleanVarWithDefaultValue).toBe(true);
  });

  it('should sanitize JSON values', () => {
    process.env.JSON_VAR =
      '{"key": "value", "nested": {"nestedKey": "nestedValue"}}';
    const config = new MockConfig();
    expect(config.jsonVar).toEqual({
      key: 'value',
      nested: { nestedKey: 'nestedValue' },
    });
  });

  it('should sanitize array values', () => {
    process.env.ARRAY_VAR = 'value1,value2,value3';
    const config = new MockConfig();
    expect(config.arrayVar).toEqual(['value1', 'value2', 'value3']);
  });

  it('should sanitize array values with custom delimiter', () => {
    process.env.ARRAY_WITH_CUSTOM_DELIMITER = 'value1|value2|value3';
    const config = new MockConfig();
    expect(config.arrayWithCustomDelimiter).toEqual([
      'value1',
      'value2',
      'value3',
    ]);
  });

  it('should use default value for array when env var is not set', () => {
    const config = new MockConfig();
    expect(config.arrayWithDefaultValue).toEqual(['defaultValue']);
  });

  it('should use default value when env var is not set', () => {
    const config = new MockConfig();
    expect(config.defaultValueVar).toBe('default');
  });

  it('should use function default value when env var is not set', () => {
    const config = new MockConfig();
    expect(config.functionDefaultValue).toBe('function default');
  });
});
