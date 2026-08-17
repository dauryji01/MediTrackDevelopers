import {
  Boxes,
  ClipboardList,
  FileBarChart,
  Home,
  PackageSearch,
  Pill,
  ShoppingCart,
  Users,
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onSelectItem: (item: string) => void;
}

const menuItems = [
  { name: 'Inicio', icon: Home },
  { name: 'Medicamentos', icon: Pill },
  { name: 'Inventario', icon: Boxes },
  { name: 'Ventas', icon: ShoppingCart },
  { name: 'Clientes', icon: Users },
  { name: 'Solicitudes', icon: ClipboardList },
  { name: 'Reportes', icon: FileBarChart },
];

function Sidebar({ activeItem, onSelectItem }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <PackageSearch size={26} />
        </div>

        <div>
          <h1>MediTrack</h1>
          <span>Gestión farmacéutica</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <p className="menu-title">MENÚ PRINCIPAL</p>

        {menuItems.map(({ name, icon: Icon }) => (
          <button
            key={name}
            type="button"
            className={`menu-item ${activeItem === name ? 'active' : ''}`}
            onClick={() => onSelectItem(name)}
          >
            <Icon size={20} />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Sistema MediTrack</p>
        <span>Versión inicial 1.0</span>
      </div>
    </aside>
  );
}

export default Sidebar;