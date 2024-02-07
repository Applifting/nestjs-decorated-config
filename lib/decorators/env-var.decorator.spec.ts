import { sanitizeEnvVar } from './env.decorator';
import * as sanitizers from './sanitizers';

describe('Env decorator', () => {
  describe('sanitizeEnvVar', () => {
    it('should apply default value from function', () => {
      const result = sanitizeEnvVar(undefined, 'invalid', {
        defaultValue: () => 'default',
        delimiter: ',',
        removeTrailingSlash: false,
      });

      expect(result).toBe('default');
    });

    it('should apply default value ', () => {
      const result = sanitizeEnvVar(undefined, 'invalid', {
        defaultValue: 'default',
        delimiter: ',',
        removeTrailingSlash: false,
      });

      expect(result).toBe('default');
    });

    describe('String', () => {
      it('should sanitize string', () => {
        jest
          .spyOn(sanitizers, 'sanitizeString')
          .mockReturnValue('return value');

        const result = sanitizeEnvVar('value', 'String', {
          delimiter: ',',
          removeTrailingSlash: false,
        });

        expect(result).toBe('return value');
      });
    });

    describe('Number', () => {
      it('should sanitize number', () => {
        jest.spyOn(sanitizers, 'sanitizeNumber').mockReturnValue(42);

        const result = sanitizeEnvVar('value', 'Number', {
          delimiter: ',',
          removeTrailingSlash: false,
        });

        expect(result).toBe(42);
      });
    });

    describe('Boolean', () => {
      it('should sanitize boolean', () => {
        jest.spyOn(sanitizers, 'sanitizeBoolean').mockReturnValue(true);

        const result = sanitizeEnvVar('value', 'Boolean', {
          delimiter: ',',
          removeTrailingSlash: false,
        });

        expect(result).toBe(true);
      });
    });

    describe('JSON', () => {
      it('should sanitize JSON', () => {
        jest
          .spyOn(sanitizers, 'sanitizeJson')
          .mockReturnValue({ test: 'value' });

        const result = sanitizeEnvVar('value', 'JSON', {
          delimiter: ',',
          removeTrailingSlash: false,
        });

        expect(result).toEqual({ test: 'value' });
      });
    });

    describe('Array', () => {
      it('should sanitize array', () => {
        jest
          .spyOn(sanitizers, 'sanitizeArray')
          .mockReturnValue(['value1', 'value2']);

        const result = sanitizeEnvVar('value1,value2', 'Array', {
          delimiter: ',',
          removeTrailingSlash: false,
        });

        expect(result).toEqual(['value1', 'value2']);
      });
    });
  });
});
