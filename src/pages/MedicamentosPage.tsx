import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  PackagePlus,
  Pencil,
  Pill,
  Search,
  Trash2,
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

interface MedicineForm {
  nombre: string;
  principioActivo: string;
  categoria: string;
  precio: string;
  stock: string;
  stockMinimo: string;
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

const emptyForm: MedicineForm = {
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MedicineForm>(emptyForm);
  const [successMessage, setSuccessMessage] = useState('');

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

  const totalUnidades = medicamentos.reduce(
    (total, medicamento) => total + medicamento.stock,
    0,
  );

  const totalStockBajo = medicamentos.filter(
    (medicamento) => medicamento.stock <= medicamento.stockMinimo,
  ).length;

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (medicamento: Medicamento) => {
    setEditingId(medicamento.id);

    setForm({
      nombre: medicamento.nombre,
      principioActivo: medicamento.principioActivo,
      categoria: medicamento.categoria,
      precio: String(medicamento.precio),
      stock: String(medicamento.stock),
      stockMinimo: String(medicamento.stockMinimo),
      vencimiento: medicamento.vencimiento,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId !== null) {
      setMedicamentos((currentMedicamentos) =>
        currentMedicamentos.map((medicamento) =>
          medicamento.id === editingId
            ? {
                ...medicamento,
                nombre: form.nombre,
                principioActivo: form.principioActivo,
                categoria: form.categoria,
                precio: Number(form.precio),
                stock: Number(form.stock),
                stockMinimo: Number(form.stockMinimo),
                vencimiento: form.vencimiento,
              }
            : medicamento,
        ),
      );

      setSuccessMessage('Medicamento actualizado correctamente.');
    } else {
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

      setMedicamentos((currentMedicamentos) => [
        nuevoMedicamento,
        ...currentMedicamentos,
      ]);

      setSuccessMessage('Medicamento agregado correctamente.');
    }

    closeForm();
  };

  const handleDelete = (medicamento: Medicamento) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${medicamento.nombre}"?`,
    );

    if (!confirmed) {
      return;
    }

    setMedicamentos((currentMedicamentos) =>
      currentMedicamentos.filter(
        (currentMedicamento) =>
          currentMedicamento.id !== medicamento.id,
      ),
    );

    setSuccessMessage('Medicamento eliminado correctamente.');
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
          onClick={openAddForm}
        >
          <PackagePlus size={20} />
          Agregar medicamento
        </button>
      </div>

      {successMessage && (
        <div className="medicine-success-message">
          <CheckCircle2 size={20} />

          <span>{successMessage}</span>

          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            aria-label="Cerrar mensaje"
          >
            <X size={18} />
          </button>
        </div>
      )}

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
            <strong>{totalUnidades}</strong>
          </div>
        </article>

        <article>
          <div className="summary-icon orange">
            <AlertTriangle size={23} />
          </div>

          <div>
            <span>Con stock bajo</span>
            <strong>{totalStockBajo}</strong>
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
                <th>Acciones</th>
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

                    <td>
                      <div className="medicine-actions">
                        <button
                          type="button"
                          className="edit-medicine"
                          onClick={() => openEditForm(medicamento)}
                          aria-label={`Editar ${medicamento.nombre}`}
                          title="Editar medicamento"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="delete-medicine"
                          onClick={() => handleDelete(medicamento)}
                          aria-label={`Eliminar ${medicamento.nombre}`}
                          title="Eliminar medicamento"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
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
                <h3>
                  {editingId !== null
                    ? 'Editar medicamento'
                    : 'Agregar medicamento'}
                </h3>

                <p>
                  {editingId !== null
                    ? 'Modifica los datos del medicamento seleccionado.'
                    : 'Completa los datos básicos del medicamento.'}
                </p>
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
              <div className="form-grid">
                <label>
                  Nombre comercial

                  <input
                    required
                    type="text"
                    value={form.nombre}
                    placeholder="Ej. Ibuprofeno 400 mg"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        nombre: event.target.value,
                      })
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
                      setForm({
                        ...form,
                        categoria: event.target.value,
                      })
                    }
                  >
                    <option value="Analgésicos">
                      Analgésicos
                    </option>

                    <option value="Antibióticos">
                      Antibióticos
                    </option>

                    <option value="Vitaminas">
                      Vitaminas
                    </option>

                    <option value="Antialérgicos">
                      Antialérgicos
                    </option>
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
                      setForm({
                        ...form,
                        precio: event.target.value,
                      })
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
                      setForm({
                        ...form,
                        stock: event.target.value,
                      })
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
                  onClick={closeForm}
                >
                  Cancelar
                </button>

                <button type="submit" className="save-button">
                  {editingId !== null
                    ? 'Guardar cambios'
                    : 'Guardar medicamento'}
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