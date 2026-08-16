import React from 'react'

const Sidebar: React.FC = () => {
  const items = [
    'Inicio',
    'Medicamentos',
    'Inventario',
    'Ventas',
    'Clientes',
    'Solicitudes',
    'Reportes',
  ]

  return (
    <aside className="sidebar">
      <div className="brand">MediTrack</div>
      <nav>
        <ul>
          {items.map((it) => (
            <li key={it}>
              <button onClick={() => alert('Próximamente: ' + it)}>{it}</button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
