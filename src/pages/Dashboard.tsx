import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { stats, alerts, lastSales } from '../data/mockData'

const Dashboard: React.FC = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />

        <main className="content">
          <h1>Inicio</h1>

          <section className="cards">
            <div className="card">
              <h3>Ventas del día</h3>
              <p className="big">S/ {stats.ventasHoy.toFixed(2)}</p>
            </div>
            <div className="card">
              <h3>Medicamentos disponibles</h3>
              <p className="big">{stats.medicamentosDisponibles}</p>
            </div>
            <div className="card">
              <h3>Stock bajo</h3>
              <p className="big">{stats.stockBajo}</p>
            </div>
            <div className="card">
              <h3>Solicitudes pendientes</h3>
              <p className="big">{stats.solicitudesPendientes}</p>
            </div>
          </section>

          <section className="actions">
            <button onClick={() => alert('Nueva venta (próximamente)')} className="primary">Nueva venta</button>
            <button onClick={() => alert('Agregar medicamento (próximamente)')}>Agregar medicamento</button>
            <button onClick={() => alert('Nueva solicitud (próximamente)')}>Nueva solicitud</button>
          </section>

          <section className="alerts-and-sales">
            <div className="alerts">
              <h2>Alertas</h2>
              <ul>
                {alerts.map((a) => (
                  <li key={a.id}>{a.text}</li>
                ))}
              </ul>
            </div>

            <div className="last-sales">
              <h2>Últimas ventas</h2>
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Items</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lastSales.map((s) => (
                    <tr key={s.id}>
                      <td>{s.cliente}</td>
                      <td>{s.items}</td>
                      <td>S/ {s.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
