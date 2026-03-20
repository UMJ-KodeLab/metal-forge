import { Link } from 'react-router-dom';
import { API_BASE } from '../services/api';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaMusic } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateItem, removeItem, itemCount, total, loading } = useCart();

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
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

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page page">
        <div className="container">
          <div className="cart-page__empty">
            <FaShoppingCart className="cart-page__empty-icon" />
            <h2>Carrinho Vazio</h2>
            <p>Explore nosso catalogo e encontre os melhores CDs de metal!</p>
            <Link to="/catalog" className="btn btn-primary">
              Ver Catalogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page">
      <div className="container">
        <h1 className="page-title">Carrinho</h1>

        <div className="cart-page__layout">
          <div className="cart-page__items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-page__item card">
                <div className="cart-page__item-image">
                  {item.Product?.coverImage ? (
                    <img
                      src={`${API_BASE}${item.Product.coverImage}`}
                      alt={item.Product.title}
                    />
                  ) : (
                    <div className="cart-page__item-placeholder">
                      <FaMusic />
                    </div>
                  )}
                </div>

                <div className="cart-page__item-info">
                  <Link to={`/product/${item.Product?.id}`}>
                    <h3 className="cart-page__item-title">{item.Product?.title}</h3>
                  </Link>
                  <p className="cart-page__item-artist">{item.Product?.artist}</p>
                  <p className="cart-page__item-price">
                    {formatPrice(item.Product?.price || 0)}
                  </p>
                </div>

                <div className="cart-page__item-controls">
                  <div className="cart-page__quantity">
                    <button
                      className="cart-page__qty-btn"
                      onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="cart-page__qty-value">{item.quantity}</span>
                    <button
                      className="cart-page__qty-btn"
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <p className="cart-page__item-total">
                    {formatPrice(item.quantity * parseFloat(item.Product?.price || 0))}
                  </p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-page__summary card">
            <h3>Resumo</h3>
            <div className="cart-page__summary-row">
              <span>Subtotal ({itemCount} itens)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="cart-page__summary-row cart-page__summary-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link
              to="/checkout"
              className="btn btn-primary cart-page__checkout-btn"
            >
              Finalizar Compra
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
