export type Movimiento = {
  categoria: string;
  total: number;
};

export type DatosDashboard = {
  esMesActual: boolean;
  ingresos: number;
  gastosFijos: number;
  gastos: Movimiento[];
  prevision: number;
};

export const datosMock: Record<string, DatosDashboard> = {
  '2025-07': {
    esMesActual: true,
    ingresos: 3200,
    gastosFijos: 900,
    gastos: [
      { categoria: 'Comida', total: 450 },
      { categoria: 'Transporte', total: 120 },
      { categoria: 'Ocio', total: 200 },
    ],
    prevision: 1600
  },
  '2025-06': {
    esMesActual: false,
    ingresos: 3100,
    gastosFijos: 800,
    gastos: [
      { categoria: 'Comida', total: 480 },
      { categoria: 'Transporte', total: 110 },
      { categoria: 'Ocio', total: 180 },
    ],
    prevision: 1550
  }
};
