import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash, FaMusic } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api, { API_BASE } from '../services/api';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setItems(data);
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleMoveToCart = async (item) => {
    try {
      await addItem(item.Product.id);
      await api.delete(`/wishlist/${item.Product.id}`);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success('Movido para o carrinho!');
    } catch {
      toast.error('Erro ao mover para carrinho');
    }
  };

  const handleRemove = async (productId, itemId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success('Removido da wishlist');
    } catch {
      toast.error('Erro ao remover');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist page">
      <div className="container">
        <h1 className="page-title">Wishlist</h1>

        {items.length === 0 ? (
          <div className="wishlist__empty">
            <FaHeart className="wishlist__empty-icon" />
            <h2>Sua wishlist esta vazia</h2>
            <p>Explore o catalogo e salve os CDs que voce deseja!</p>
            <Link to="/catalog" className="btn btn-primary">
              Ver Catalogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-4">
            {items.map((item) => (
              <div key={item.id} className="card wishlist__card">
                <Link to={`/product/${item.Product?.id}`}>
                  {item.Product?.coverImage ? (
                    <img
                      src={`${API_BASE}${item.Product.coverImage}`}
                      alt={item.Product.title}
                      className="wishlist__image"
                    />
                  ) : (
                    <div className="wishlist__placeholder">
                      <FaMusic />
                    </div>
                  )}
                </Link>
                <div className="wishlist__info">
                  <h4>{item.Product?.title}</h4>
                  <p>{item.Product?.artist}</p>
                  <span className="wishlist__price">
                    {formatPrice(item.Product?.price || 0)}
                  </span>
                  <div className="wishlist__actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleMoveToCart(item)}
                    >
                      <FaShoppingCart /> Mover para Carrinho
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.Product?.id, item.id)}
                    >
                      <FaTrash /> Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
