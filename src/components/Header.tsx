import { Bell, Search, UserRound } from 'lucide-react';

function Header() {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Buscar medicamentos, clientes..."
          aria-label="Buscar"
        />
      </div>

      <div className="user-section">
        <button
          type="button"
          className="notification-button"
          aria-label="Notificaciones"
        >
          <Bell size={21} />
          <span className="notification-dot" />
        </button>

        <div className="user-avatar">
          <UserRound size={20} />
        </div>

        <div className="user-information">
          <strong>admin</strong>
          <span>Administrador</span>
        </div>
      </div>
    </header>
  );
}

export default Header;