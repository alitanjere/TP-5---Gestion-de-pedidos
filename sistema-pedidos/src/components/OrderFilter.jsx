import { ORDER_STATUSES } from '../constants.js'

function OrderFilter({ selectedStatus, onChange }) {
  return (
    <div className="order-filter">
      <label className="order-filter__label" htmlFor="order-status-filter">
        Filtrar por estado
      </label>
      <select
        id="order-status-filter"
        className="order-filter__select"
        value={selectedStatus}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="all">Todos</option>
        {ORDER_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default OrderFilter
