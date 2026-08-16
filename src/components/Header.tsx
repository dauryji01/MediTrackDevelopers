import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="topbar">
      <div className="search">
        <input placeholder="Buscar..." />
      </div>
      <div className="top-actions">
        <button className="icon-btn" title="Notificaciones">🔔</button>
        <div className="user">Juan Pérez</div>
      </div>
    </header>
  )
}

export default Header
