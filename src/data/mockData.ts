export interface Sale {
  id: string;
  customer: string;
  items: number;
  total: string;
  time: string;
  status: 'Completada' | 'Pendiente';
}

export interface Alert {
  id: number;
  type: 'warning' | 'danger';
  title: string;
  description: string;
}

export const recentSales: Sale[] = [
  {
    id: 'V-00125',
    customer: 'María Rodríguez',
    items: 3,
    total: 'RD$ 1,250.00',
    time: '10:35 a. m.',
    status: 'Completada',
  },
  {
    id: 'V-00124',
    customer: 'Carlos Martínez',
    items: 2,
    total: 'RD$ 875.00',
    time: '9:50 a. m.',
    status: 'Completada',
  },
  {
    id: 'V-00123',
    customer: 'Ana Jiménez',
    items: 5,
    total: 'RD$ 2,340.00',
    time: '9:15 a. m.',
    status: 'Completada',
  },
  {
    id: 'V-00122',
    customer: 'Luis Fernández',
    items: 1,
    total: 'RD$ 450.00',
    time: '8:40 a. m.',
    status: 'Pendiente',
  },
];

export const alerts: Alert[] = [
  {
    id: 1,
    type: 'warning',
    title: 'Medicamentos próximos a vencer',
    description: '8 medicamentos vencen en los próximos 30 días.',
  },
  {
    id: 2,
    type: 'danger',
    title: 'Medicamentos con stock bajo',
    description: '5 medicamentos necesitan ser reabastecidos.',
  },
];