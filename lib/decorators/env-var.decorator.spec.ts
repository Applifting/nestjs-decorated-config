import { sanitizeEnvVar } from './env.decorator';

describe('Env decorator', () => {
  describe('sanitizeEnvVar', () => {
    describe('Number', () => {
      it('should return the value if the value is defined and the type is Number', () => {
        const value = sanitizeEnvVar('1', 'Number', false, 'default');
        expect(value).toBe(1);
      });

      it('should return the default value if the value is undefined and the type is Number', () => {
        const value = sanitizeEnvVar(undefined, 'Number', false, 1);
        expect(value).toBe(1);
      });

      it('should return the default value if the value is undefined and the type is Number and default value is a function that returns 1', () => {
        const value = sanitizeEnvVar(undefined, 'Number', false, () => 1);
        expect(value).toBe(1);
      });

      it('should return undefined if the value is undefined and the type is Number and default value is undefined', () => {
        const value = sanitizeEnvVar(undefined, 'Number', false, undefined);
        expect(value).toBe(undefined);
      });

      it('should return undefined if the value is empty string and the type is Number and default value is undefined', () => {
        const value = sanitizeEnvVar('', 'Number', false, undefined);
        expect(value).toBe(undefined);
      });

      it('should return NaN if the value is any string and the type is Number and default value is undefined', () => {
        const value = sanitizeEnvVar('invalid', 'Number', false, undefined);
        expect(value).toBe(NaN);
      });
    });

    describe('Boolean', () => {
      it('should return true if the value is defined and the type is Boolean', () => {
        const value = sanitizeEnvVar('true', 'Boolean', false, 'default');
        expect(value).toBe(true);
      });

      it('should return false if the value is defined and the type is Boolean', () => {
        const value = sanitizeEnvVar('false', 'Boolean', false, 'default');
        expect(value).toBe(false);
      });

      it('should return false if the value is undefined and the type is Boolean and default value is false', () => {
        const value = sanitizeEnvVar(undefined, 'Boolean', false, false);
        expect(value).toBe(false);
      });

      it('should return false if the value is undefined and the type is Boolean and default value is a function that returns false', () => {
        const value = sanitizeEnvVar(undefined, 'Boolean', false, () => false);
        expect(value).toBe(false);
      });

      it('should return false if the value is undefined and the type is Boolean and default value is true', () => {
        const value = sanitizeEnvVar(undefined, 'Boolean', false, true);
        expect(value).toBe(true);
      });

      it('should return false if the env var is any string', () => {
        const value = sanitizeEnvVar('invalid', 'Boolean', false, undefined);
        expect(value).toBe(false);
      });

      it('should return undefined if the env var is empty string', () => {
        const value = sanitizeEnvVar('', 'Boolean', false, undefined);
        expect(value).toBe(undefined);
      });
    });

    describe('String', () => {
      it('should return the default value if the value is undefined', () => {
        const value = sanitizeEnvVar(undefined, 'String', false, 'default');
        expect(value).toBe('default');
      });

      it('should return the default value if the value is undefined and the default value is a callable', () => {
        const value = sanitizeEnvVar(
          undefined,
          'String',
          false,
          () => 'default',
        );
        expect(value).toBe('default');
      });

      it('should return the value if the value is defined', () => {
        const value = sanitizeEnvVar('value', 'String', false, 'default');
        expect(value).toBe('value');
      });

      it('should remove the trailing slash if the value is defined and the type is String and removeTrailingSlash is true', () => {
        const value = sanitizeEnvVar('value/', 'String', true, 'default');
        expect(value).toBe('value');
      });

      it('should not remove the trailing slash if the value is defined and the type is String and removeTrailingSlash is false', () => {
        const value = sanitizeEnvVar('value/', 'String', false, 'default');
        expect(value).toBe('value/');
      });
    });

    describe('JSON', () => {
      it('should return object if the value is defined and the type is JSON', () => {
        const value = sanitizeEnvVar(
          '{"key": "value"}',
          'JSON',
          false,
          undefined,
        );
        expect(value).toEqual({ key: 'value' });
      });

      it('should return object if the value is defined and the type is JSON', () => {
        const value = sanitizeEnvVar(undefined, 'JSON', false, {
          key: 'defaultValue',
        });
        expect(value).toEqual({ key: 'defaultValue' });
      });
    });
  });
});
