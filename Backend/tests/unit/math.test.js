import { sum, multiply, divide } from '../../src/modules/math.js';

describe('Math Utils', () => {
  describe('sum', () => {
    test('debe sumar dos números positivos', () => {
      expect(sum(2, 3)).toBe(5);
    });

    test('debe sumar números negativos', () => {
      expect(sum(-1, -1)).toBe(-2);
    });
  });

  describe('multiply', () => {
    test('debe multiplicar dos números', () => {
      expect(multiply(3, 4)).toBe(12);
    });
  });

  describe('divide', () => {
    test('debe dividir dos números', () => {
      expect(divide(10, 2)).toBe(5);
    });

    test('debe lanzar error al dividir por cero', () => {
      expect(() => divide(10, 0)).toThrow('No se puede dividir por cero');
    });
  });
});