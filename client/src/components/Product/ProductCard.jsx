import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart, FaMusic } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api, { API_BASE } from '../../services/api';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(product.wishlisted || false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Faça login para adicionar ao carrinho');
      return;
    }
    try {
      await addItem(product.id);
      toast.success('Adicionado ao carrinho!');
    } catch {
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Faça login para usar a lista de desejos');
      return;
    }
    if (loadingWishlist) return;
    setLoadingWishlist(true);
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${product.id}`);
        setWishlisted(false);
        toast.info('Removido da lista de desejos');
      } else {
        await api.post('/wishlist', { productId: product.id });
        setWishlisted(true);
        toast.success('Adicionado à lista de desejos!');
      }
    } catch {
      toast.error('Erro ao atualizar lista de desejos');
    } finally {
      setLoadingWishlist(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__image-wrapper">
        {product.coverImage ? (
          <img
            src={`${API_BASE}${product.coverImage}`}
            alt={`${product.title} - ${product.artist}`}
            className="product-card__image"
          />
        ) : (
          <div className="product-card__placeholder">
            <FaMusic className="product-card__placeholder-icon" />
          </div>
        )}
        <button
          className={`product-card__wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleToggleWishlist}
          title={wishlisted ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
        >
          {wishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="product-card__info">
        <p className="product-card__artist">{product.artist}</p>
        <h3 className="product-card__title">{product.title}</h3>

        {product.genres && product.genres.length > 0 && (
          <div className="product-card__genres">
            {product.genres.map((genre) => (
              <span key={genre.id || genre.slug || genre} className="product-card__genre-badge">
                {genre.name || genre}
              </span>
            ))}
          </div>
        )}

        <div className="product-card__footer">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          <button className="product-card__cart-btn" onClick={handleAddToCart}>
            <FaShoppingCart />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
