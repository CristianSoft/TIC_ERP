export const DROPDOWN_MENUS = [
  {
    name: 'Aportaciones',
    items: [
      { name: 'Aportantes', path: '/aportaciones/aportantes' },
      {
        name: 'Planes de suscripción',
        path: '/aportaciones/planes-aportacion',
      },
    ],
  },
  {
    name: 'Eventos',
    items: [
      { name: 'Próximos eventos', path: '/eventos' },
      { name: 'Solicitar presupuesto', path: '/eventos/solicitud-presupuesto' },
    ],
  },
  {
    name: 'Inventario',
    items: [
      { name: 'Movimientos', path: '/inventario/movimientos' },
      { name: 'Proveedores', path: '/proveedores' },
      { name: 'Productos', path: '/inventario/productos' },
    ],
  },
  {
    name: 'Financiero',
    items: [
      { name: 'Transacciones', path: '/finanzas/transacciones' },
      { name: 'Cuentas Contables', path: '/finanzas/cuentas-contables' },
    ],
  },
];

export const ADMIN_MEMBERS_TABLE_HEADERS = [
  { key: 'position', label: 'Rol' },
  { key: 'firstName', label: 'Nombre' },
  { key: 'lastName', label: 'Apellido' },
  { key: 'birthDate', label: 'Fecha de Nacimiento' },
  { key: 'cellphone', label: 'Número de Celular' },
  { key: 'faculty', label: 'Facultad' },
  { key: 'career', label: 'Carrera' },
  { key: 'semester', label: 'Semestre' },
  { key: 'email', label: 'Correo Institucional' },
];

export const INFO_TABLE_HEADERS = [
  { key: 'mission', label: 'Misión' },
  { key: 'vision', label: 'Visión' },
];

export const BUDGET_REQUEST_TABLE_HEADERS = [
  'Nombre del evento', //selector
  'Estado de la solicitud', //selector
  'Motivo', //I
  'Valor', //I
];

export const ACCOUNT_TABLE_HEADERS = [
  'Tipo de Cuenta',
  'Cuenta',
  'Valor Actual',
  'Fecha de creación',
];

export const SUBSCRIBER_TABLE_HEADERS = [
  'Fecha',
  'Nombre Completo',
  'Facultad',
  'Carrera',
  'Correo institucional',
  'Plan de portación',
  'Valor',
  'Periodo académico',
];

export const SUBSCRIPTION_PLAN_TABLE_HEADERS = [
  'Nombre',
  'Precio',
  'Beneficios',
  'Periodo académico',
];

export const TRANSACTION_TABLE_HEADERS = [
  'Fecha',
  'Cuenta de origen',
  'Cuenta de destino',
  'Valor',
  'Tipo de transacción',
  'Descripción',
];

export const INVENTORY_TABLE_HEADERS = [
  'Producto',
  'Tipo de movimiento',
  'Cantidad',
  'Fecha',
];

export const PRODUCTS_TABLE_HEADERS = [
  'Nombre',
  'Categoría',
  'Descripción',
  'Precio',
  'Cantidad',
  'Etiqueta',
  'Proveedor',
];

export const SUPPLIERS_TABLE_HEADERS = ['Nombre', 'Teléfono Celular', 'Correo'];

export const EVENTS_TABLE_HEADERS = [
  'Título',
  'Fase del evento',
  'Descripción',
  'Fecha de inicio',
  'Fecha de fin',
  'Presupuesto',
  'Estado del presupuesto',
  'Lugar',
  'Ingresos',
];

export const DEFAULT_STATE = 1;
export const INACTIVE_STATE = 2;
