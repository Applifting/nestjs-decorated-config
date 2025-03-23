import {
  sanitizeArray,
  sanitizeBoolean,
  sanitizeJson,
  sanitizeNumber,
  sanitizeString,
} from './sanitizers';

describe('sanitizers', () => {
  describe('sanitizeString', () => {
    it('should sanitize string', () => {
      const result = sanitizeString('value', false);

      expect(result).toBe('value');
    });

    it('should remove trailing slash', () => {
      const result = sanitizeString('value/', true);

      expect(result).toBe('value');
    });

    it("should not remove trailing slash if it's not there", () => {
      const result = sanitizeString('value', true);

      expect(result).toBe('value');
    });

    it('should return undefined', () => {
      const result = sanitizeString(undefined, false);

      expect(result).toBe(undefined);
    });
  });

  describe('sanitizeNumber', () => {
    it('should sanitize number', () => {
      const result = sanitizeNumber('42');

      expect(result).toBe(42);
    });

    it('should return NaN', () => {
      const result = sanitizeNumber(undefined);

      expect(result).toBe(NaN);
    });
  });

  describe('sanitizeBoolean', () => {
    it('should sanitize boolean', () => {
      const result = sanitizeBoolean('true');

      expect(result).toBe(true);
    });

    it('should return false', () => {
      const result = sanitizeBoolean(undefined);

      expect(result).toBe(false);
    });
  });

  describe('sanitizeJson', () => {
    it('should sanitize json string', () => {
      const result = sanitizeJson('{"key": "value"}');

      expect(result).toEqual({ key: 'value' });
    });

    it('should return object if it is already parsed', () => {
      const result = sanitizeJson({ key: 'value' });

      expect(result).toEqual({ key: 'value' });
    });

    it('should return undefined', () => {
      const result = sanitizeJson(undefined);

      expect(result).toBe(undefined);
    });
  });

  describe('sanitizeArray', () => {
    it('should sanitize array', () => {
      const result = sanitizeArray('value1,value2', ',');

      expect(result).toEqual(['value1', 'value2']);
    });

    it('should not separate if delimiter is wrong', () => {
      const result = sanitizeArray('value1,value2', '/');

      expect(result).toEqual(['value1,value2']);
    });

    it('should return empty array', () => {
      const result = sanitizeArray(undefined, ',');

      expect(result).toEqual([]);
    });

    it('should return default value', () => {
      const result = sanitizeArray(['defaultValue'], ',');

      expect(result).toEqual(['defaultValue']);
    });
  });
});
