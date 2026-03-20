import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaCompactDisc, FaGuitar, FaClipboardList, FaStore } from 'react-icons/fa';
import './AdminLayout.css';

const sidebarLinks = [
  { to: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard', end: true },
  { to: '/admin/produtos', icon: <FaCompactDisc />, label: 'Produtos' },
  { to: '/admin/generos', icon: <FaGuitar />, label: 'Generos' },
  { to: '/admin/pedidos', icon: <FaClipboardList />, label: 'Pedidos' },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Metal Forge</h2>
          <span>Admin</span>
        </div>

        <nav className="admin-nav">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-link back-link">
            <FaStore />
            <span>Voltar a Loja</span>
          </NavLink>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
