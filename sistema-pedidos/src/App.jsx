import { useMemo, useState } from 'react'
import './App.css'
import OrderFilter from './components/OrderFilter.jsx'
import OrderForm from './components/OrderForm.jsx'
import OrderList from './components/OrderList.jsx'
import OrderStats from './components/OrderStats.jsx'
import { DEFAULT_ORDER_STATUS, ORDER_STATUS_LABELS } from './constants.js'

const DEFAULT_ORDERS = [
  {
    id: '0001',
    customer: 'Laura Fernández',
    status: 'pending',
    date: '2024-04-12',
    products: [
      { name: 'Caja de embalaje', quantity: 3, price: 8500 },
      { name: 'Etiqueta térmica', quantity: 10, price: 320 },
    ],
  },
  {
    id: '0002',
    customer: 'Juan Pérez',
    status: 'shipped',
    date: '2024-04-10',
    products: [
      { name: 'Organizador de escritorio', quantity: 1, price: 18450 },
      { name: 'Lapiceras', quantity: 5, price: 750 },
    ],
  },
  {
    id: '0003',
    customer: 'María González',
    status: 'delivered',
    date: '2024-04-01',
    products: [
      { name: 'Auriculares bluetooth', quantity: 2, price: 21999 },
    ],
  },
]

function normalizeDateString(dateValue) {
  const referenceDate = dateValue ? new Date(dateValue) : new Date()

  if (Number.isNaN(referenceDate.getTime())) {
    throw new Error('La fecha del pedido no es válida.')
  }

  return referenceDate.toISOString().split('T')[0]
}

function normalizeProducts(products = []) {
  if (products.length === 0) {
    throw new Error('El pedido debe incluir al menos un producto.')
  }

  return products.map((product, index) => {
    const name = product.name?.trim()
    const quantity = Number(product.quantity)
    const price = Number(product.price)

    if (!name) {
      throw new Error(`El producto #${index + 1} debe tener un nombre.`)
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`La cantidad del producto "${name}" debe ser mayor a 0.`)
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`El precio del producto "${name}" no puede ser negativo.`)
    }

    return {
      name,
      quantity,
      price,
    }
  })
}

function getNextOrderId(orders) {
  const lastId = orders.reduce((maxId, order) => {
    const numericId = Number.parseInt(order.id, 10)

    if (Number.isNaN(numericId)) {
      return maxId
    }

    return Math.max(maxId, numericId)
  }, 0)

  const nextNumericId = lastId + 1
  return nextNumericId.toString().padStart(4, '0')
}

function createOrder(orderDraft, existingOrders) {
  const customer = orderDraft.customer?.trim() ?? ''

  if (customer.length < 3) {
    throw new Error('El nombre del cliente debe tener al menos 3 caracteres.')
  }

  const status = orderDraft.status && ORDER_STATUS_LABELS[orderDraft.status]
    ? orderDraft.status
    : DEFAULT_ORDER_STATUS

  const date = normalizeDateString(orderDraft.date)
  const products = normalizeProducts(orderDraft.products)

  return {
    id: getNextOrderId(existingOrders),
    customer,
    status,
    date,
    products,
  }
}

function App() {
  const [orders, setOrders] = useState(DEFAULT_ORDERS)
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'all') {
      return orders
    }

    return orders.filter((order) => order.status === selectedStatus)
  }, [orders, selectedStatus])

  const handleAddOrder = (orderDraft) => {
    setOrders((previousOrders) => {
      const newOrder = createOrder(orderDraft, previousOrders)
      return [...previousOrders, newOrder]
    })
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Gestión de Pedidos</h1>
        <p>Gestioná los pedidos de MailAméricas con información clara y validaciones de negocio.</p>
      </header>

      <section className="app-controls">
        <OrderFilter selectedStatus={selectedStatus} onChange={setSelectedStatus} />
        <OrderStats orders={orders} />
      </section>

      <div className="app-dashboard">
        <section className="app-panel">
          <div className="app-panel__header">
            <h2>Pedidos</h2>
            {selectedStatus !== 'all' && (
              <span className="app-panel__filter">Filtro: {ORDER_STATUS_LABELS[selectedStatus]}</span>
            )}
          </div>
          <OrderList orders={filteredOrders} />
        </section>

        <section className="app-panel">
          <h2>Agregar nuevo pedido</h2>
          <OrderForm onSubmit={handleAddOrder} />
        </section>
      </div>
    </div>
  )
}

export default App
