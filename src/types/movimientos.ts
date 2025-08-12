export type Movimiento = {
  _id?: string;
  tipo: 'ingreso' | 'gasto';
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: string;
  esFijo: boolean;
};