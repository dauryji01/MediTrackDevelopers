import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  CheckCircle2,
  PackageCheck,
  Search,
  X,
} from 'lucide-react';

import './InventarioPage.css';

interface InventoryItem {
  id: number;
  medicamento: string;
  lote: string;
  ubicacion: string;
  stock: number;
  stockMinimo: number;
  vencimiento: string;
}

interface MovementForm {
  medicamentoId: string;
  tipo: 'entrada' | 'salida';
  cantidad: string;
  motivo: string;
}

const initialInventory: InventoryItem[] = [
  {
    id: 1,
    medicamento: 'Acetaminofén 500 mg',
    lote: 'LOT-2026-001',
    ubicacion: 'Estante A-01',
    stock: 45,
    stockMinimo: 10,
    vencimiento: '2027-03-15',
  },
  {
    id: 2,
    medicamento: 'Amoxicilina 500 mg',
    lote: 'LOT-2026-002',
    ubicacion: 'Estante B-04',
    stock: 8,
    stockMinimo: 15,
    vencimiento: '2026-11-20',
  },
  {
    id: 3,
    medicamento: 'Vitamina C',
    lote: 'LOT-2026-003',
    ubicacion: 'Estante C-02',
    stock: 32,
    stockMinimo: 10,
    vencimiento: '2027-08-10',
  },
  {
    id: 4,
    medicamento: 'Loratadina 10 mg',
    lote: 'LOT-2026-004',
    ubicacion: 'Estante A-06',
    stock: 6,
    stockMinimo: 10,
    vencimiento: '2026-10-05',
  },
];

const emptyMovement: MovementForm = {
  medicamentoId: '',
  tipo: 'entrada',
  cantidad: '',
  motivo: '',
};

function InventarioPage() {
  const [inventory, setInventory] =
    useState<InventoryItem[]>(initialInventory);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [movement, setMovement] =
    useState<MovementForm>(emptyMovement);

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const filteredInventory = useMemo(() => {
    const text = search.toLowerCase().trim();

    return inventory.filter((item) => {
      const matchesText =
        item.medicamento.toLowerCase().includes(text) ||
        item.lote.toLowerCase().includes(text) ||
        item.ubicacion.toLowerCase().includes(text);

      const lowStock = item.stock <= item.stockMinimo;

      const matchesStatus =
        statusFilter === 'Todos' ||
        (statusFilter === 'Disponible' && !lowStock) ||
        (statusFilter === 'Stock bajo' && lowStock);

      return matchesText && matchesStatus;
    });
  }, [inventory, search, statusFilter]);

  const totalUnits = inventory.reduce(
    (total, item) => total + item.stock,
    0,
  );

  const lowStockItems = inventory.filter(
    (item) => item.stock <= item.stockMinimo,
  ).length;

  const availableItems = inventory.filter(
    (item) => item.stock > item.stockMinimo,
  ).length;

  const openMovementForm = (
    type: 'entrada' | 'salida',
    itemId?: number,
  ) => {
    setMovement({
      medicamentoId: itemId ? String(itemId) : '',
      tipo: type,
      cantidad: '',
      motivo: '',
    });

    setErrorMessage('');
    setShowMovementForm(true);
  };

  const closeMovementForm = () => {
    setShowMovementForm(false);
    setMovement(emptyMovement);
    setErrorMessage('');
  };

  const handleMovement = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const medicineId = Number(movement.medicamentoId);
    const quantity = Number(movement.cantidad);

    const selectedItem = inventory.find(
      (item) => item.id === medicineId,
    );

    if (!selectedItem) {
      setErrorMessage('Selecciona un medicamento.');
      return;
    }

    if (quantity <= 0) {
      setErrorMessage('La cantidad debe ser mayor que cero.');
      return;
    }

    if (
      movement.tipo === 'salida' &&
      quantity > selectedItem.stock
    ) {
      setErrorMessage(
        `No hay suficientes unidades. Stock disponible: ${selectedItem.stock}.`,
      );

      return;
    }

    setInventory((currentInventory) =>
      currentInventory.map((item) => {
        if (item.id !== medicineId) {
          return item;
        }

        return {
          ...item,
          stock:
            movement.tipo === 'entrada'
              ? item.stock + quantity
              : item.stock - quantity,
        };
      }),
    );

    const action =
      movement.tipo === 'entrada' ? 'Entrada' : 'Salida';

    setMessage(
      `${action} de ${quantity} unidades registrada correctamente.`,
    );

    closeMovementForm();
  };

  return (
    <section className="inventory-page">
      <div className="inventory-heading">
        <div>
          <p className="eyebrow">CONTROL DE EXISTENCIAS</p>
          <h2>Inventario</h2>

          <span>
            Consulta las existencias y registra movimientos.
          </span>
        </div>

        <div className="inventory-main-actions">
          <button
            type="button"
            className="inventory-entry-button"
            onClick={() => openMovementForm('entrada')}
          >
            <ArrowDownToLine size={19} />
            Registrar entrada
          </button>

          <button
            type="button"
            className="inventory-exit-button"
            onClick={() => openMovementForm('salida')}
          >
            <ArrowUpFromLine size={19} />
            Registrar salida
          </button>
        </div>
      </div>

      {message && (
        <div className="inventory-message">
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

      <div className="inventory-summary">
        <article>
          <div className="inventory-summary-icon blue">
            <Boxes size={23} />
          </div>

          <div>
            <span>Total de unidades</span>
            <strong>{totalUnits}</strong>
          </div>
        </article>

        <article>
          <div className="inventory-summary-icon green">
            <PackageCheck size={23} />
          </div>

          <div>
            <span>Productos disponibles</span>
            <strong>{availableItems}</strong>
          </div>
        </article>

        <article>
          <div className="inventory-summary-icon orange">
            <AlertTriangle size={23} />
          </div>

          <div>
            <span>Productos con stock bajo</span>
            <strong>{lowStockItems}</strong>
          </div>
        </article>
      </div>

      <div className="inventory-content">
        <div className="inventory-toolbar">
          <div className="inventory-search">
            <Search size={19} />

            <input
              type="text"
              value={search}
              placeholder="Buscar medicamento, lote o ubicación..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="Todos">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Stock bajo">Stock bajo</option>
          </select>
        </div>

        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Lote</th>
                <th>Ubicación</th>
                <th>Existencias</th>
                <th>Stock mínimo</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th>Movimiento</th>
              </tr>
            </thead>

            <tbody>
              {filteredInventory.map((item) => {
                const lowStock =
                  item.stock <= item.stockMinimo;

                return (
                  <tr key={item.id}>
                    <td className="inventory-medicine">
                      {item.medicamento}
                    </td>

                    <td>{item.lote}</td>
                    <td>{item.ubicacion}</td>

                    <td>
                      <strong>{item.stock}</strong> unidades
                    </td>

                    <td>{item.stockMinimo}</td>
                    <td>{item.vencimiento}</td>

                    <td>
                      <span
                        className={`inventory-status ${
                          lowStock ? 'low' : 'available'
                        }`}
                      >
                        {lowStock
                          ? 'Stock bajo'
                          : 'Disponible'}
                      </span>
                    </td>

                    <td>
                      <div className="movement-actions">
                        <button
                          type="button"
                          className="small-entry-button"
                          title="Registrar entrada"
                          onClick={() =>
                            openMovementForm('entrada', item.id)
                          }
                        >
                          <ArrowDownToLine size={17} />
                        </button>

                        <button
                          type="button"
                          className="small-exit-button"
                          title="Registrar salida"
                          onClick={() =>
                            openMovementForm('salida', item.id)
                          }
                        >
                          <ArrowUpFromLine size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredInventory.length === 0 && (
            <div className="empty-inventory">
              No se encontraron productos en el inventario.
            </div>
          )}
        </div>
      </div>

      {showMovementForm && (
        <div className="modal-background">
          <div className="inventory-modal">
            <div className="modal-header">
              <div>
                <h3>
                  Registrar{' '}
                  {movement.tipo === 'entrada'
                    ? 'entrada'
                    : 'salida'}
                </h3>

                <p>
                  Registra un movimiento en el inventario.
                </p>
              </div>

              <button
                type="button"
                className="close-modal"
                onClick={closeMovementForm}
                aria-label="Cerrar formulario"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleMovement}>
              {errorMessage && (
                <div className="inventory-error">
                  <AlertTriangle size={18} />
                  {errorMessage}
                </div>
              )}

              <label>
                Medicamento

                <select
                  required
                  value={movement.medicamentoId}
                  onChange={(event) =>
                    setMovement({
                      ...movement,
                      medicamentoId: event.target.value,
                    })
                  }
                >
                  <option value="">
                    Selecciona un medicamento
                  </option>

                  {inventory.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.medicamento} — {item.stock} unidades
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Tipo de movimiento

                <select
                  value={movement.tipo}
                  onChange={(event) =>
                    setMovement({
                      ...movement,
                      tipo: event.target.value as
                        | 'entrada'
                        | 'salida',
                    })
                  }
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                </select>
              </label>

              <label>
                Cantidad

                <input
                  required
                  min="1"
                  type="number"
                  value={movement.cantidad}
                  placeholder="Cantidad de unidades"
                  onChange={(event) =>
                    setMovement({
                      ...movement,
                      cantidad: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Motivo

                <textarea
                  required
                  rows={3}
                  value={movement.motivo}
                  placeholder="Ej. Compra a proveedor"
                  onChange={(event) =>
                    setMovement({
                      ...movement,
                      motivo: event.target.value,
                    })
                  }
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeMovementForm}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="save-movement-button"
                >
                  Registrar movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default InventarioPage;