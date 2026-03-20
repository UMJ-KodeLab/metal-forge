import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaSignOutAlt, FaCog, FaSearch } from 'react-icons/fa';
import { GiMetalBar } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <GiMetalBar className="logo-icon" />
          <span className="logo-text">Metal Forge</span>
        </Link>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar CDs, bandas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit"><FaSearch /></button>
        </form>

        <nav className="nav">
          <Link to="/catalog" className="nav-link">Catalogo</Link>

          {user ? (
            <>
              <Link to="/wishlist" className="nav-link icon-link" title="Wishlist">
                <FaHeart />
              </Link>
              <Link to="/cart" className="nav-link icon-link cart-link" title="Carrinho">
                <FaShoppingCart />
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <div className="user-menu">
                <button className="user-btn">
                  <FaUser /> {user.name.split(' ')[0]}
                </button>
                <div className="dropdown">
                  <Link to="/profile"><FaUser /> Meu Perfil</Link>
                  <Link to="/orders"><FaShoppingCart /> Meus Pedidos</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin"><FaCog /> Painel Admin</Link>
                  )}
                  <button onClick={logout}><FaSignOutAlt /> Sair</button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
