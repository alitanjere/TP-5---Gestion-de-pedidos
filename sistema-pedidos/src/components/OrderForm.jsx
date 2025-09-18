import { useState } from 'react'
import { DEFAULT_ORDER_STATUS, ORDER_STATUSES } from '../constants.js'

const TODAY = new Date().toISOString().split('T')[0]

function createEmptyProduct() {
  return {
    name: '',
    quantity: 1,
    price: 0,
  }
}

function OrderForm({ onSubmit }) {
  const [customer, setCustomer] = useState('')
  const [status, setStatus] = useState(DEFAULT_ORDER_STATUS)
  const [date, setDate] = useState(TODAY)
  const [products, setProducts] = useState([createEmptyProduct()])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleProductChange = (index, field, value) => {
    setProducts((previousProducts) => {
      return previousProducts.map((product, productIndex) => {
        if (productIndex !== index) {
          return product
        }

        if (field === 'quantity' || field === 'price') {
          const numericValue = value === '' ? value : Number(value)
          return { ...product, [field]: numericValue }
        }

        return { ...product, [field]: value }
      })
    })
  }

  const handleAddProduct = () => {
    setProducts((previousProducts) => [...previousProducts, createEmptyProduct()])
  }

  const handleRemoveProduct = (indexToRemove) => {
    setProducts((previousProducts) => {
      if (previousProducts.length === 1) {
        return previousProducts
      }

      return previousProducts.filter((_, index) => index !== indexToRemove)
    })
  }

  const resetForm = () => {
    setCustomer('')
    setStatus(DEFAULT_ORDER_STATUS)
    setDate(TODAY)
    setProducts([createEmptyProduct()])
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const orderDraft = {
      customer,
      status,
      date,
      products: products.map((product) => ({
        name: product.name,
        quantity: Number(product.quantity),
        price: Number(product.price),
      })),
    }

    try {
      onSubmit(orderDraft)
      setError('')
      setSuccess('Pedido agregado correctamente.')
      resetForm()
    } catch (submissionError) {
      setSuccess('')
      setError(submissionError.message)
    }
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="order-form__group">
        <label htmlFor="order-customer">Cliente</label>
        <input
          id="order-customer"
          name="customer"
          type="text"
          value={customer}
          onChange={(event) => setCustomer(event.target.value)}
          placeholder="Ej: Ana Martínez"
          minLength={3}
          required
        />
      </div>

      <div className="order-form__group order-form__group--inline">
        <div>
          <label htmlFor="order-status">Estado</label>
          <select
            id="order-status"
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {ORDER_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="order-date">Fecha</label>
          <input
            id="order-date"
            name="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            max={TODAY}
          />
        </div>
      </div>

      <fieldset className="order-form__fieldset">
        <legend>Productos</legend>
        {products.map((product, index) => (
          <div key={`product-${index}`} className="order-form__product-row">
            <input
              type="text"
              placeholder="Nombre del producto"
              value={product.name}
              onChange={(event) => handleProductChange(index, 'name', event.target.value)}
              required
            />
            <input
              type="number"
              min="1"
              step="1"
              value={product.quantity}
              onChange={(event) => handleProductChange(index, 'quantity', event.target.value)}
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={product.price}
              onChange={(event) => handleProductChange(index, 'price', event.target.value)}
              required
            />
            <button
              type="button"
              className="order-form__remove"
              onClick={() => handleRemoveProduct(index)}
              disabled={products.length === 1}
            >
              Quitar
            </button>
          </div>
        ))}
        <button type="button" className="order-form__add" onClick={handleAddProduct}>
          Agregar producto
        </button>
      </fieldset>

      {error && <p className="order-form__error">{error}</p>}
      {success && <p className="order-form__success">{success}</p>}

      <button type="submit" className="order-form__submit">
        Guardar pedido
      </button>
    </form>
  )
}

export default OrderForm
