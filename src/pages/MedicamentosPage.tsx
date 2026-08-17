import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import {
  AlertTriangle,
  PackagePlus,
  Pill,
  Search,
  X,
} from 'lucide-react';

import './MedicamentosPage.css';

interface Medicamento {
  id: number;
  nombre: string;
  principioActivo: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  vencimiento: string;
}

const initialMedicamentos: Medicamento[] = [
  {
    id: 1,
    nombre: 'Acetaminofén 500 mg',
    principioActivo: 'Paracetamol',
    categoria: 'Analgésicos',
    precio: 150,
    stock: 45,
    stockMinimo: 10,
    vencimiento: '2027-03-15',
  },
  {
    id: 2,
    nombre: 'Amoxicilina 500 mg',
    principioActivo: 'Amoxicilina',
    categoria: 'Antibióticos',
    precio: 475,
    stock: 8,
    stockMinimo: 15,
    vencimiento: '2026-11-20',
  },
  {
    id: 3,
    nombre: 'Vitamina C',
    principioActivo: 'Ácido ascórbico',
    categoria: 'Vitaminas',
    precio: 280,
    stock: 32,
    stockMinimo: 10,
    vencimiento: '2027-08-10',
  },
  {
    id: 4,
    nombre: 'Loratadina 10 mg',
    principioActivo: 'Loratadina',
    categoria: 'Antialérgicos',
    precio: 225,
    stock: 6,
    stockMinimo: 10,
    vencimiento: '2026-10-05',
  },
];

const emptyForm = {
  nombre: '',
  principioActivo: '',
  categoria: 'Analgésicos',
  precio: '',
  stock: '',
  stockMinimo: '',
  vencimiento: '',
};

function MedicamentosPage() {
  const [medicamentos, setMedicamentos] =
    useState<Medicamento[]>(initialMedicamentos);

  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const medicamentosFiltrados = useMemo(() => {
    const text = search.toLowerCase().trim();

    return medicamentos.filter((medicamento) => {
      const coincideTexto =
        medicamento.nombre.toLowerCase().includes(text) ||
        medicamento.principioActivo.toLowerCase().includes(text);

      const coincideCategoria =
        categoria === 'Todas' || medicamento.categoria === categoria;

      return coincideTexto && coincideCategoria;
    });
  }, [medicamentos, search, categoria]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nuevoMedicamento: Medicamento = {
      id: Date.now(),
      nombre: form.nombre,
      principioActivo: form.principioActivo,
      categoria: form.categoria,
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockMinimo: Number(form.stockMinimo),
      vencimiento: form.vencimiento,
    };

    setMedicamentos((current) => [nuevoMedicamento, ...current]);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <section className="medicamentos-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">GESTIÓN DE MEDICAMENTOS</p>
          <h2>Medicamentos</h2>
          <span>
            Consulta y administra los medicamentos registrados.
          </span>
        </div>

        <button
          type="button"
          className="add-medicine-button"
          onClick={() => setShowForm(true)}
        >
          <PackagePlus size={20} />
          Agregar medicamento
        </button>
      </div>

      <div className="medicine-summary">
        <article>
          <div className="summary-icon blue">
            <Pill size={23} />
          </div>

          <div>
            <span>Total registrados</span>
            <strong>{medicamentos.length}</strong>
          </div>
        </article>

        <article>
          <div className="summary-icon green">
            <Pill size={23} />
          </div>

          <div>
            <span>Unidades disponibles</span>
            <strong>
              {medicamentos.reduce(
                (total, medicamento) => total + medicamento.stock,
                0,
              )}
            </strong>
          </div>
        </article>

        <article>
          <div className="summary-icon orange">
            <AlertTriangle size={23} />
          </div>

          <div>
            <span>Con stock bajo</span>
            <strong>
              {
                medicamentos.filter(
                  (medicamento) =>
                    medicamento.stock <= medicamento.stockMinimo,
                ).length
              }
            </strong>
          </div>
        </article>
      </div>

      <div className="medicine-content">
        <div className="medicine-toolbar">
          <div className="medicine-search">
            <Search size={19} />

            <input
              type="text"
              value={search}
              placeholder="Buscar por nombre o principio activo..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            <option value="Analgésicos">Analgésicos</option>
            <option value="Antibióticos">Antibióticos</option>
            <option value="Vitaminas">Vitaminas</option>
            <option value="Antialérgicos">Antialérgicos</option>
          </select>
        </div>

        <div className="medicine-table-container">
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Vencimiento</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {medicamentosFiltrados.map((medicamento) => {
                const stockBajo =
                  medicamento.stock <= medicamento.stockMinimo;

                return (
                  <tr key={medicamento.id}>
                    <td>
                      <div className="medicine-name">
                        <div className="medicine-table-icon">
                          <Pill size={19} />
                        </div>

                        <div>
                          <strong>{medicamento.nombre}</strong>
                          <span>{medicamento.principioActivo}</span>
                        </div>
                      </div>
                    </td>

                    <td>{medicamento.categoria}</td>

                    <td className="medicine-price">
                      RD$ {medicamento.precio.toFixed(2)}
                    </td>

                    <td>{medicamento.stock} unidades</td>

                    <td>{medicamento.vencimiento}</td>

                    <td>
                      <span
                        className={`medicine-status ${
                          stockBajo ? 'low' : 'available'
                        }`}
                      >
                        {stockBajo ? 'Stock bajo' : 'Disponible'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {medicamentosFiltrados.length === 0 && (
            <div className="empty-medicines">
              No se encontraron medicamentos.
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-background">
          <div className="medicine-modal">
            <div className="modal-header">
              <div>
                <h3>Agregar medicamento</h3>
                <p>Completa los datos básicos del medicamento.</p>
              </div>

              <button
                type="button"
                className="close-modal"
                onClick={() => setShowForm(false)}
                aria-label="Cerrar formulario"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Nombre comercial
                  <input
                    required
                    type="text"
                    value={form.nombre}
                    placeholder="Ej. Ibuprofeno 400 mg"
                    onChange={(event) =>
                      setForm({ ...form, nombre: event.target.value })
                    }
                  />
                </label>

                <label>
                  Principio activo
                  <input
                    required
                    type="text"
                    value={form.principioActivo}
                    placeholder="Ej. Ibuprofeno"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        principioActivo: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Categoría
                  <select
                    value={form.categoria}
                    onChange={(event) =>
                      setForm({ ...form, categoria: event.target.value })
                    }
                  >
                    <option>Analgésicos</option>
                    <option>Antibióticos</option>
                    <option>Vitaminas</option>
                    <option>Antialérgicos</option>
                  </select>
                </label>

                <label>
                  Precio
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.precio}
                    placeholder="0.00"
                    onChange={(event) =>
                      setForm({ ...form, precio: event.target.value })
                    }
                  />
                </label>

                <label>
                  Cantidad disponible
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.stock}
                    placeholder="0"
                    onChange={(event) =>
                      setForm({ ...form, stock: event.target.value })
                    }
                  />
                </label>

                <label>
                  Stock mínimo
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.stockMinimo}
                    placeholder="0"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        stockMinimo: event.target.value,
                      })
                    }
                  />
                </label>

                <label className="full-field">
                  Fecha de vencimiento
                  <input
                    required
                    type="date"
                    value={form.vencimiento}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        vencimiento: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="save-button">
                  Guardar medicamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MedicamentosPage;