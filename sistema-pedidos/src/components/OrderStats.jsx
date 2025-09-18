import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '../constants.js'

function OrderStats({ orders }) {
  const totalOrders = orders.length

  const totalsByStatus = orders.reduce((totals, order) => {
    const currentTotal = totals[order.status] ?? 0
    return {
      ...totals,
      [order.status]: currentTotal + 1,
    }
  }, {})

  return (
    <section className="order-stats">
      <h2 className="order-stats__title">Estadísticas generales</h2>
      <p className="order-stats__total">
        Total de pedidos: <strong>{totalOrders}</strong>
      </p>
      <div className="order-stats__grid">
        {ORDER_STATUSES.map((status) => (
          <article key={status.value} className="order-stats__card">
            <span className={`order-status order-status--${status.value}`}>
              {ORDER_STATUS_LABELS[status.value]}
            </span>
            <span className="order-stats__count">
              {totalsByStatus[status.value] ?? 0}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default OrderStats
