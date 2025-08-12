export type DatosDashboard = {
  esMesActual: boolean;
  ingresos: number;
  gastos: Array<{
    categoria: string;
    total: number;
  }>;
  gastosFijos: number;
  prevision: number;
};