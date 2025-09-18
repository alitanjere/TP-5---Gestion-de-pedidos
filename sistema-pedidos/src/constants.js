export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
]

export const ORDER_STATUS_LABELS = ORDER_STATUSES.reduce((labels, status) => {
  return { ...labels, [status.value]: status.label }
}, {})

export const DEFAULT_ORDER_STATUS = 'pending'
