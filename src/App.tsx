import { useState } from 'react';
import {
  AlertTriangle,
  BellRing,
  CircleDollarSign,
  ClipboardPlus,
  PackageCheck,
  PackagePlus,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MedicamentosPage from './pages/MedicamentosPage';
import { alerts, recentSales } from './data/mockData';

import './App.css';

function App() {
  const [activeItem, setActiveItem] = useState('Inicio');
  const [message, setMessage] = useState('');

  const showComingSoon = (section: string) => {
    setActiveItem(section);

    if (section === 'Inicio' || section === 'Medicamentos') {
      setMessage('');
      return;
    }

    setMessage(`El módulo de ${section} estará disponible próximamente.`);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'Agregar medicamento') {
      setActiveItem('Medicamentos');
      setMessage('');
      return;
    }

    setMessage(`${action}: esta funcionalidad estará disponible próximamente.`);
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeItem={activeItem}
        onSelectItem={showComingSoon}
      />

      <div className="main-area">
        <Header />

        <main className="dashboard">
          {activeItem === 'Medicamentos' ? (
            <MedicamentosPage />
          ) : (
            <>
              <section className="dashboard-heading">
                <div>
                  <p className="eyebrow">PANEL PRINCIPAL</p>
                  <h2>Buenos días, Joel</h2>
                  <span>
                    Aquí tienes un resumen de la actividad de la farmacia.
                  </span>
                </div>

                <div className="current-date">
                  Resumen de hoy
                </div>
              </section>

              {message && (
                <div className="coming-soon-message">
                  <BellRing size={19} />

                  <span>{message}</span>

                  <button
                    type="button"
                    onClick={() => setMessage('')}
                  >
                    Cerrar
                  </button>
                </div>
              )}

              <section className="stats-grid">
                <article className="stat-card">
                  <div className="stat-icon blue">
                    <CircleDollarSign size={25} />
                  </div>

                  <div>
                    <p>Ventas del día</p>
                    <h3>RD$ 18,450</h3>

                    <span className="positive">
                      <TrendingUp size={15} />
                      12 % más que ayer
                    </span>
                  </div>
                </article>

                <article className="stat-card">
                  <div className="stat-icon green">
                    <PackageCheck size={25} />
                  </div>

                  <div>
                    <p>Medicamentos disponibles</p>
                    <h3>1,248</h3>
                    <span>Productos registrados</span>
                  </div>
                </article>

                <article className="stat-card">
                  <div className="stat-icon orange">
                    <AlertTriangle size={25} />
                  </div>

                  <div>
                    <p>Stock bajo</p>
                    <h3>5</h3>
                    <span>Requieren atención</span>
                  </div>
                </article>

                <article className="stat-card">
                  <div className="stat-icon purple">
                    <ClipboardPlus size={25} />
                  </div>

                  <div>
                    <p>Solicitudes pendientes</p>
                    <h3>7</h3>
                    <span>Sin procesar</span>
                  </div>
                </article>
              </section>

              <section className="quick-actions-section">
                <div className="section-title">
                  <div>
                    <h3>Acciones rápidas</h3>
                    <p>
                      Accede a las operaciones más utilizadas.
                    </p>
                  </div>
                </div>

                <div className="quick-actions">
                  <button
                    type="button"
                    className="quick-action primary"
                    onClick={() =>
                      handleQuickAction('Nueva venta')
                    }
                  >
                    <ShoppingCart size={25} />
                    <span>Nueva venta</span>
                  </button>

                  <button
                    type="button"
                    className="quick-action secondary"
                    onClick={() =>
                      handleQuickAction('Agregar medicamento')
                    }
                  >
                    <PackagePlus size={25} />
                    <span>Agregar medicamento</span>
                  </button>

                  <button
                    type="button"
                    className="quick-action light"
                    onClick={() =>
                      handleQuickAction('Nueva solicitud')
                    }
                  >
                    <ClipboardPlus size={25} />
                    <span>Nueva solicitud</span>
                  </button>
                </div>
              </section>

              <section className="dashboard-bottom">
                <article className="panel alerts-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Alertas</h3>
                      <p>
                        Situaciones que necesitan atención.
                      </p>
                    </div>

                    <AlertTriangle size={21} />
                  </div>

                  <div className="alerts-list">
                    {alerts.map((alert) => (
                      <div
                        className="alert-item"
                        key={alert.id}
                      >
                        <div
                          className={`alert-indicator ${alert.type}`}
                        >
                          <AlertTriangle size={18} />
                        </div>

                        <div>
                          <strong>{alert.title}</strong>
                          <p>{alert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel sales-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Últimas ventas</h3>
                      <p>
                        Operaciones registradas recientemente.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="text-button"
                      onClick={() => showComingSoon('Ventas')}
                    >
                      Ver todas
                    </button>
                  </div>

                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Venta</th>
                          <th>Cliente</th>
                          <th>Productos</th>
                          <th>Total</th>
                          <th>Hora</th>
                          <th>Estado</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentSales.map((sale) => (
                          <tr key={sale.id}>
                            <td className="sale-code">
                              {sale.id}
                            </td>

                            <td>{sale.customer}</td>

                            <td>{sale.items}</td>

                            <td className="sale-total">
                              {sale.total}
                            </td>

                            <td>{sale.time}</td>

                            <td>
                              <span
                                className={`status ${
                                  sale.status === 'Completada'
                                    ? 'completed'
                                    : 'pending'
                                }`}
                              >
                                {sale.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;