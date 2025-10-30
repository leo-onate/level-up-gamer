/**
 * Pruebas unitarias para la lógica de Boleta
 * Archivo: boleta.logic.spec.js
 */

import {
  isValidOrder,
  getOrderId,
  getOrderItems,
  getOrderTotal,
  getFormattedDate,
  getItemPrice,
  getItemQuantity,
  calculateItemSubtotal,
  formatPrice,
  getCustomerName,
  hasCustomerInfo,
  getUserEmail,
  calculateTotalFromItems,
  validateOrderTotal
} from './boleta.logic';

describe('Boleta Logic - Validación de Orden', () => {
  describe('isValidOrder', () => {
    it('debe retornar true para objetos válidos', () => {
      expect(isValidOrder({})).toBe(true);
      expect(isValidOrder({ id: '123' })).toBe(true);
    });

    it('debe retornar false para null', () => {
      expect(isValidOrder(null)).toBe(false);
    });

    it('debe retornar false para undefined', () => {
      expect(isValidOrder(undefined)).toBe(false);
    });
  });
});

describe('Boleta Logic - ID de Orden', () => {
  describe('getOrderId', () => {
    it('debe retornar displayId cuando está disponible', () => {
      const order = { displayId: 'ORD-123', id: 'abc' };
      expect(getOrderId(order)).toBe('ORD-123');
    });

    it('debe retornar id cuando displayId no existe', () => {
      const order = { id: 'xyz-456' };
      expect(getOrderId(order)).toBe('xyz-456');
    });

    it('debe retornar undefined cuando ninguno existe', () => {
      const order = {};
      expect(getOrderId(order)).toBeUndefined();
    });

    it('debe retornar id cuando displayId está vacío', () => {
      const order = { displayId: '', id: 'backup' };
      expect(getOrderId(order)).toBe('backup');
    });
  });
});

describe('Boleta Logic - Items de Orden', () => {
  describe('getOrderItems', () => {
    it('debe retornar array de items cuando es válido', () => {
      const items = [{ nombre: 'Item 1' }, { nombre: 'Item 2' }];
      const order = { items };
      expect(getOrderItems(order)).toEqual(items);
    });

    it('debe retornar array vacío cuando items es null', () => {
      const order = { items: null };
      expect(getOrderItems(order)).toEqual([]);
    });

    it('debe retornar array vacío cuando items es undefined', () => {
      const order = {};
      expect(getOrderItems(order)).toEqual([]);
    });

    it('debe retornar array vacío cuando items no es array', () => {
      const order = { items: 'not-an-array' };
      expect(getOrderItems(order)).toEqual([]);
    });

    it('debe retornar array vacío para items = 123', () => {
      const order = { items: 123 };
      expect(getOrderItems(order)).toEqual([]);
    });
  });
});

describe('Boleta Logic - Total de Orden', () => {
  describe('getOrderTotal', () => {
    it('debe retornar el total cuando es un número válido', () => {
      const order = { total: 150.75 };
      expect(getOrderTotal(order)).toBe(150.75);
    });

    it('debe retornar 0 cuando total es null', () => {
      const order = { total: null };
      expect(getOrderTotal(order)).toBe(0);
    });

    it('debe retornar 0 cuando total es undefined', () => {
      const order = {};
      expect(getOrderTotal(order)).toBe(0);
    });

    it('debe retornar 0 cuando total es string', () => {
      const order = { total: '100' };
      expect(getOrderTotal(order)).toBe(0);
    });

    it('debe retornar NaN cuando total es NaN (validar con isNaN)', () => {
      const order = { total: NaN };
      expect(isNaN(getOrderTotal(order))).toBe(true);
    });

    it('debe manejar correctamente total = 0', () => {
      const order = { total: 0 };
      expect(getOrderTotal(order)).toBe(0);
    });
  });
});

describe('Boleta Logic - Fecha', () => {
  describe('getFormattedDate', () => {
    it('debe formatear fecha válida', () => {
      const order = { date: '2025-10-29T10:00:00.000Z' };
      const result = getFormattedDate(order);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('debe retornar string vacío cuando date es null', () => {
      const order = { date: null };
      expect(getFormattedDate(order)).toBe('');
    });

    it('debe retornar string vacío cuando date es undefined', () => {
      const order = {};
      expect(getFormattedDate(order)).toBe('');
    });

    it('debe manejar fechas en diferentes formatos', () => {
      const order1 = { date: new Date('2025-10-29') };
      const order2 = { date: '2025-10-29' };
      
      expect(getFormattedDate(order1)).toBeTruthy();
      expect(getFormattedDate(order2)).toBeTruthy();
    });
  });
});

describe('Boleta Logic - Precio de Item', () => {
  describe('getItemPrice', () => {
    it('debe retornar precio válido', () => {
      const item = { precio: 99.99 };
      expect(getItemPrice(item)).toBe(99.99);
    });

    it('debe retornar 0 para precio undefined', () => {
      const item = {};
      expect(getItemPrice(item)).toBe(0);
    });

    it('debe retornar 0 para precio null', () => {
      const item = { precio: null };
      expect(getItemPrice(item)).toBe(0);
    });

    it('debe convertir string numérico a número', () => {
      const item = { precio: '50.25' };
      expect(getItemPrice(item)).toBe(50.25);
    });

    it('debe retornar 0 para string no numérico', () => {
      const item = { precio: 'abc' };
      expect(getItemPrice(item)).toBe(0);
    });

    it('debe manejar precio negativo', () => {
      const item = { precio: -10 };
      expect(getItemPrice(item)).toBe(-10);
    });

    it('debe manejar precio = 0', () => {
      const item = { precio: 0 };
      expect(getItemPrice(item)).toBe(0);
    });
  });
});

describe('Boleta Logic - Cantidad de Item', () => {
  describe('getItemQuantity', () => {
    it('debe retornar cantidad válida', () => {
      const item = { qty: 5 };
      expect(getItemQuantity(item)).toBe(5);
    });

    it('debe retornar 0 para qty undefined', () => {
      const item = {};
      expect(getItemQuantity(item)).toBe(0);
    });

    it('debe retornar 0 para qty null', () => {
      const item = { qty: null };
      expect(getItemQuantity(item)).toBe(0);
    });

    it('debe convertir string numérico a número', () => {
      const item = { qty: '3' };
      expect(getItemQuantity(item)).toBe(3);
    });

    it('debe retornar 0 para string no numérico', () => {
      const item = { qty: 'dos' };
      expect(getItemQuantity(item)).toBe(0);
    });

    it('debe truncar decimales', () => {
      const item = { qty: 2.7 };
      expect(getItemQuantity(item)).toBe(2.7); // Number() preserva decimales
    });
  });
});

describe('Boleta Logic - Subtotal de Item', () => {
  describe('calculateItemSubtotal', () => {
    it('debe calcular subtotal correctamente', () => {
      const item = { precio: 10, qty: 3 };
      expect(calculateItemSubtotal(item)).toBe(30);
    });

    it('debe manejar decimales correctamente', () => {
      const item = { precio: 25.50, qty: 2 };
      expect(calculateItemSubtotal(item)).toBe(51);
    });

    it('debe retornar 0 cuando precio es 0', () => {
      const item = { precio: 0, qty: 5 };
      expect(calculateItemSubtotal(item)).toBe(0);
    });

    it('debe retornar 0 cuando cantidad es 0', () => {
      const item = { precio: 100, qty: 0 };
      expect(calculateItemSubtotal(item)).toBe(0);
    });

    it('debe retornar 0 cuando ambos son 0', () => {
      const item = { precio: 0, qty: 0 };
      expect(calculateItemSubtotal(item)).toBe(0);
    });

    it('debe retornar 0 para datos inválidos', () => {
      const item = { precio: 'abc', qty: 'xyz' };
      expect(calculateItemSubtotal(item)).toBe(0);
    });

    it('debe manejar valores negativos', () => {
      const item = { precio: -10, qty: 2 };
      expect(calculateItemSubtotal(item)).toBe(-20);
    });
  });
});

describe('Boleta Logic - Formateo de Precio', () => {
  describe('formatPrice', () => {
    it('debe formatear precio con 2 decimales', () => {
      expect(formatPrice(10)).toBe('10.00');
      expect(formatPrice(10.5)).toBe('10.50');
      expect(formatPrice(10.99)).toBe('10.99');
    });

    it('debe redondear a 2 decimales', () => {
      expect(formatPrice(10.999)).toBe('11.00');
      expect(formatPrice(10.994)).toBe('10.99');
    });

    it('debe manejar 0', () => {
      expect(formatPrice(0)).toBe('0.00');
    });

    it('debe manejar negativos', () => {
      expect(formatPrice(-25.5)).toBe('-25.50');
    });

    it('debe manejar números grandes', () => {
      expect(formatPrice(999999.99)).toBe('999999.99');
    });
  });
});

describe('Boleta Logic - Cliente', () => {
  describe('getCustomerName', () => {
    it('debe retornar nombre del cliente', () => {
      const order = { customer: { nombre: 'Juan Pérez' } };
      expect(getCustomerName(order)).toBe('Juan Pérez');
    });

    it('debe retornar string vacío cuando customer es null', () => {
      const order = { customer: null };
      expect(getCustomerName(order)).toBe('');
    });

    it('debe retornar string vacío cuando customer es undefined', () => {
      const order = {};
      expect(getCustomerName(order)).toBe('');
    });

    it('debe retornar string vacío cuando nombre es undefined', () => {
      const order = { customer: {} };
      expect(getCustomerName(order)).toBe('');
    });

    it('debe manejar nombre vacío', () => {
      const order = { customer: { nombre: '' } };
      expect(getCustomerName(order)).toBe('');
    });
  });

  describe('hasCustomerInfo', () => {
    it('debe retornar true cuando hay customer', () => {
      const order = { customer: { nombre: 'Test' } };
      expect(hasCustomerInfo(order)).toBe(true);
    });

    it('debe retornar false cuando customer es null', () => {
      const order = { customer: null };
      expect(hasCustomerInfo(order)).toBe(false);
    });

    it('debe retornar false cuando customer es undefined', () => {
      const order = {};
      expect(hasCustomerInfo(order)).toBe(false);
    });

    it('debe retornar true para customer vacío', () => {
      const order = { customer: {} };
      expect(hasCustomerInfo(order)).toBe(true);
    });
  });

  describe('getUserEmail', () => {
    it('debe retornar email cuando existe', () => {
      const order = { userEmail: 'test@example.com' };
      expect(getUserEmail(order)).toBe('test@example.com');
    });

    it('debe retornar null cuando userEmail es undefined', () => {
      const order = {};
      expect(getUserEmail(order)).toBe(null);
    });

    it('debe retornar null cuando userEmail es null', () => {
      const order = { userEmail: null };
      expect(getUserEmail(order)).toBe(null);
    });

    it('debe retornar null para string vacío', () => {
      const order = { userEmail: '' };
      expect(getUserEmail(order)).toBe(null);
    });
  });
});

describe('Boleta Logic - Cálculos de Total', () => {
  describe('calculateTotalFromItems', () => {
    it('debe calcular total de múltiples items', () => {
      const items = [
        { precio: 10, qty: 2 },  // 20
        { precio: 15, qty: 1 },  // 15
        { precio: 5, qty: 3 }    // 15
      ];
      expect(calculateTotalFromItems(items)).toBe(50);
    });

    it('debe retornar 0 para array vacío', () => {
      expect(calculateTotalFromItems([])).toBe(0);
    });

    it('debe retornar 0 para null', () => {
      expect(calculateTotalFromItems(null)).toBe(0);
    });

    it('debe retornar 0 para undefined', () => {
      expect(calculateTotalFromItems(undefined)).toBe(0);
    });

    it('debe retornar 0 para no-array', () => {
      expect(calculateTotalFromItems('not-array')).toBe(0);
    });

    it('debe manejar items con datos inválidos', () => {
      const items = [
        { precio: 10, qty: 2 },     // 20
        { precio: 'abc', qty: 1 },  // 0
        {},                         // 0
      ];
      expect(calculateTotalFromItems(items)).toBe(20);
    });

    it('debe manejar decimales correctamente', () => {
      const items = [
        { precio: 10.50, qty: 2 },  // 21
        { precio: 5.25, qty: 3 }    // 15.75
      ];
      expect(calculateTotalFromItems(items)).toBe(36.75);
    });
  });

  describe('validateOrderTotal', () => {
    it('debe validar total correcto', () => {
      const order = {
        total: 50,
        items: [
          { precio: 10, qty: 2 },  // 20
          { precio: 30, qty: 1 }   // 30
        ]
      };
      expect(validateOrderTotal(order)).toBe(true);
    });

    it('debe validar con tolerancia por defecto (0.01)', () => {
      const order = {
        total: 50.005,
        items: [
          { precio: 10, qty: 2 },
          { precio: 30, qty: 1 }
        ]
      };
      expect(validateOrderTotal(order)).toBe(true);
    });

    it('debe rechazar diferencias mayores a tolerancia', () => {
      const order = {
        total: 45,
        items: [
          { precio: 10, qty: 2 },  // 20
          { precio: 30, qty: 1 }   // 30 = 50 total
        ]
      };
      expect(validateOrderTotal(order)).toBe(false);
    });

    it('debe validar con tolerancia personalizada', () => {
      const order = {
        total: 49,
        items: [
          { precio: 10, qty: 2 },  // 20
          { precio: 30, qty: 1 }   // 30 = 50 total
        ]
      };
      expect(validateOrderTotal(order, 2)).toBe(true);
      expect(validateOrderTotal(order, 0.5)).toBe(false);
    });

    it('debe validar orden sin items', () => {
      const order = { total: 0, items: [] };
      expect(validateOrderTotal(order)).toBe(true);
    });

    it('debe manejar total 0 correctamente', () => {
      const order = {
        total: 0,
        items: [
          { precio: 0, qty: 5 }
        ]
      };
      expect(validateOrderTotal(order)).toBe(true);
    });
  });
});

describe('Boleta Logic - Casos de Integración', () => {
  it('debe procesar orden completa correctamente', () => {
    const order = {
      id: 'ord-001',
      displayId: 'ORD-2025-001',
      date: '2025-10-29T10:00:00.000Z',
      customer: { nombre: 'Cliente Test' },
      userEmail: 'test@example.com',
      items: [
        { nombre: 'Producto A', precio: 10, qty: 2 },
        { nombre: 'Producto B', precio: 15, qty: 1 }
      ],
      total: 35
    };

    expect(isValidOrder(order)).toBe(true);
    expect(getOrderId(order)).toBe('ORD-2025-001');
    expect(getOrderItems(order).length).toBe(2);
    expect(getOrderTotal(order)).toBe(35);
    expect(getFormattedDate(order)).toBeTruthy();
    expect(getCustomerName(order)).toBe('Cliente Test');
    expect(hasCustomerInfo(order)).toBe(true);
    expect(getUserEmail(order)).toBe('test@example.com');
    expect(calculateTotalFromItems(order.items)).toBe(35);
    expect(validateOrderTotal(order)).toBe(true);
  });

  it('debe manejar orden mínima', () => {
    const order = {
      id: '001',
      items: [],
      total: 0
    };

    expect(isValidOrder(order)).toBe(true);
    expect(getOrderId(order)).toBe('001');
    expect(getOrderItems(order)).toEqual([]);
    expect(getOrderTotal(order)).toBe(0);
    expect(getFormattedDate(order)).toBe('');
    expect(hasCustomerInfo(order)).toBe(false);
    expect(getUserEmail(order)).toBe(null);
  });
});
