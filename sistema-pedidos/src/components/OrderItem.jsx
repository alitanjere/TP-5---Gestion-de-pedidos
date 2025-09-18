import { ORDER_STATUS_LABELS } from '../constants.js'

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

const DATE_FORMAT_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

function formatDate(dateValue) {
  const parsedDate = dateValue ? new Date(dateValue) : new Date()

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue
  }

  return parsedDate.toLocaleDateString('es-AR', DATE_FORMAT_OPTIONS)
}

function calculateOrderTotal(products) {
  return products.reduce((total, product) => {
    return total + product.quantity * product.price
  }, 0)
}

function OrderItem({ order }) {
  const total = calculateOrderTotal(order.products)

  return (
    <article className={`order-card order-card--${order.status}`}>
      <header className="order-card__header">
        <div>
          <h3 className="order-card__title">Pedido #{order.id}</h3>
          <p className="order-card__customer">{order.customer}</p>
        </div>
        <div className="order-card__meta">
          <span className={`order-status order-status--${order.status}`}>
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </span>
          <time className="order-card__date" dateTime={order.date}>
            {formatDate(order.date)}
          </time>
        </div>
      </header>

      <ul className="order-card__products">
        {order.products.map((product, index) => {
          const subtotal = product.quantity * product.price
          return (
            <li key={`${product.name}-${index}`} className="order-card__product">
              <div>
                <p className="order-card__product-name">{product.name}</p>
                <p className="order-card__product-quantity">
                  Cantidad: {product.quantity}
                </p>
              </div>
              <div className="order-card__product-prices">
                <span>{currencyFormatter.format(product.price)}</span>
                <span className="order-card__product-subtotal">
                  {currencyFormatter.format(subtotal)}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <footer className="order-card__footer">
        <span>Total del pedido</span>
        <strong>{currencyFormatter.format(total)}</strong>
      </footer>
    </article>
  )
}

export default OrderItem
