import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import {
  CheckCircle2,
  CircleDollarSign,
  Plus,
  ReceiptText,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react';

import './VentasPage.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface Sale {
  id: string;
  cliente: string;
  medicamento: string;
  cantidad: number;
  total: number;
  fecha: string;
  estado: 'Completada' | 'Pendiente';
}

interface SaleForm {
  cliente: string;
  medicamentoId: string;
  cantidad: string;
}

const products: Product[] = [
  {
    id: 1,
    nombre: 'Acetaminofén 500 mg',
    precio: 150,
    stock: 45,
  },
  {
    id: 2,
    nombre: 'Amoxicilina 500 mg',
    precio: 475,
    stock: 8,
  },
  {
    id: 3,
    nombre: 'Vitamina C',
    precio: 280,
    stock: 32,
  },
  {
    id: 4,
    nombre: 'Loratadina 10 mg',
    precio: 225,
    stock: 6,
  },
];

const initialSales: Sale[] = [
  {
    id: 'V-00125',
    cliente: 'María Rodríguez',
    medicamento: 'Acetaminofén 500 mg',
    cantidad: 2,
    total: 300,
    fecha: '17/08/2026 - 10:35 a. m.',
    estado: 'Completada',
  },
  {
    id: 'V-00124',
    cliente: 'Carlos Martínez',
    medicamento: 'Amoxicilina 500 mg',
    cantidad: 1,
    total: 475,
    fecha: '17/08/2026 - 9:50 a. m.',
    estado: 'Completada',
  },
  {
    id: 'V-00123',
    cliente: 'Ana Jiménez',
    medicamento: 'Vitamina C',
    cantidad: 3,
    total: 840,
    fecha: '17/08/2026 - 9:15 a. m.',
    estado: 'Completada',
  },
];

const emptyForm: SaleForm = {
  cliente: '',
  medicamentoId: '',
  cantidad: '1',
};

function VentasPage() {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SaleForm>(emptyForm);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedProduct = products.find(
    (product) => product.id === Number(form.medicamentoId),
  );

  const quantity = Number(form.cantidad) || 0;
  const saleTotal = selectedProduct
    ? selectedProduct.precio * quantity
    : 0;

  const filteredSales = useMemo(() => {
    const text = search.toLowerCase().trim();

    return sales.filter(
      (sale) =>
        sale.id.toLowerCase().includes(text) ||
        sale.cliente.toLowerCase().includes(text) ||
        sale.medicamento.toLowerCase().includes(text),
    );
  }, [sales, search]);

  const totalSales = sales.reduce(
    (total, sale) => total + sale.total,
    0,
  );

  const totalProducts = sales.reduce(
    (total, sale) => total + sale.cantidad,
    0,
  );

  const openForm = () => {
    setForm(emptyForm);
    setErrorMessage('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setErrorMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedProduct) {
      setErrorMessage('Selecciona un medicamento.');
      return;
    }

    if (quantity <= 0) {
      setErrorMessage('La cantidad debe ser mayor que cero.');
      return;
    }

    if (quantity > selectedProduct.stock) {
      setErrorMessage(
        `Solo hay ${selectedProduct.stock} unidades disponibles.`,
      );

      return;
    }

    const nextNumber = sales.length + 126;

    const newSale: Sale = {
      id: `V-${String(nextNumber).padStart(5, '0')}`,
      cliente: form.cliente,
      medicamento: selectedProduct.nombre,
      cantidad: quantity,
      total: saleTotal,
      fecha: new Date().toLocaleString('es-DO'),
      estado: 'Completada',
    };

    setSales((currentSales) => [newSale, ...currentSales]);
    setMessage(`La venta ${newSale.id} fue registrada correctamente.`);
    closeForm();
  };

  return (
    <section className="sales-page">
      <div className="sales-heading">
        <div>
          <p className="eyebrow">GESTIÓN DE VENTAS</p>
          <h2>Ventas</h2>

          <span>
            Consulta y registra las ventas de la farmacia.
          </span>
        </div>

        <button
          type="button"
          className="new-sale-button"
          onClick={openForm}
        >
          <Plus size={20} />
          Nueva venta
        </button>
      </div>

      {message && (
        <div className="sales-success-message">
          <CheckCircle2 size={20} />

          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage('')}
            aria-label="Cerrar mensaje"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="sales-summary">
        <article>
          <div className="sales-summary-icon blue">
            <CircleDollarSign size={23} />
          </div>

          <div>
            <span>Total vendido</span>

            <strong>
              RD${' '}
              {totalSales.toLocaleString('es-DO', {
                minimumFractionDigits: 2,
              })}
            </strong>
          </div>
        </article>

        <article>
          <div className="sales-summary-icon green">
            <ReceiptText size={23} />
          </div>

          <div>
            <span>Ventas registradas</span>
            <strong>{sales.length}</strong>
          </div>
        </article>

        <article>
          <div className="sales-summary-icon purple">
            <ShoppingCart size={23} />
          </div>

          <div>
            <span>Productos vendidos</span>
            <strong>{totalProducts}</strong>
          </div>
        </article>
      </div>

      <div className="sales-content">
        <div className="sales-toolbar">
          <div className="sales-search">
            <Search size={19} />

            <input
              type="text"
              value={search}
              placeholder="Buscar venta, cliente o medicamento..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="sales-table-container">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Medicamento</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="sale-number">{sale.id}</td>
                  <td>{sale.cliente}</td>
                  <td>{sale.medicamento}</td>
                  <td>{sale.cantidad}</td>

                  <td className="sales-total">
                    RD${' '}
                    {sale.total.toLocaleString('es-DO', {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td>{sale.fecha}</td>

                  <td>
                    <span className="sales-status">
                      {sale.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSales.length === 0 && (
            <div className="empty-sales">
              No se encontraron ventas.
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-background">
          <div className="sales-modal">
            <div className="modal-header">
              <div>
                <h3>Nueva venta</h3>
                <p>Completa los datos de la venta.</p>
              </div>

              <button
                type="button"
                className="close-modal"
                onClick={closeForm}
                aria-label="Cerrar formulario"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="sales-error-message">
                  {errorMessage}
                </div>
              )}

              <label>
                Cliente

                <input
                  required
                  type="text"
                  value={form.cliente}
                  placeholder="Nombre del cliente"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      cliente: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Medicamento

                <select
                  required
                  value={form.medicamentoId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      medicamentoId: event.target.value,
                    })
                  }
                >
                  <option value="">
                    Selecciona un medicamento
                  </option>

                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nombre} — RD$ {product.precio}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Cantidad

                <input
                  required
                  min="1"
                  type="number"
                  value={form.cantidad}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      cantidad: event.target.value,
                    })
                  }
                />
              </label>

              {selectedProduct && (
                <div className="sale-calculation">
                  <div>
                    <span>Precio unitario</span>

                    <strong>
                      RD${' '}
                      {selectedProduct.precio.toFixed(2)}
                    </strong>
                  </div>

                  <div>
                    <span>Stock disponible</span>

                    <strong>
                      {selectedProduct.stock} unidades
                    </strong>
                  </div>

                  <div className="calculation-total">
                    <span>Total</span>

                    <strong>
                      RD$ {saleTotal.toFixed(2)}
                    </strong>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="save-sale-button"
                >
                  Registrar venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default VentasPage;