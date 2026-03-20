import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaMusic, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [addingWishlist, setAddingWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        toast.error('Produto nao encontrado');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Faca login para adicionar ao carrinho');
      return;
    }
    setAddingCart(true);
    try {
      await addItem(product.id, quantity);
      toast.success('Adicionado ao carrinho!');
    } catch {
      toast.error('Erro ao adicionar ao carrinho');
    } finally {
      setAddingCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Faca login para usar a lista de desejos');
      return;
    }
    setAddingWishlist(true);
    try {
      await api.post('/wishlist', { productId: product.id });
      toast.success('Adicionado a lista de desejos!');
    } catch {
      toast.error('Erro ao adicionar a lista de desejos');
    } finally {
      setAddingWishlist(false);
    }
  };

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

  if (!product) {
    return (
      <div className="page container">
        <p className="product-detail__not-found">Produto nao encontrado.</p>
      </div>
    );
  }

  return (
    <div className="product-detail page">
      <div className="container">
        <div className="product-detail__layout">
          <div className="product-detail__image-section">
            {product.coverImage ? (
              <img
                src={product.coverImage}
                alt={`${product.title} - ${product.artist}`}
                className="product-detail__image"
              />
            ) : (
              <div className="product-detail__placeholder">
                <FaMusic className="product-detail__placeholder-icon" />
              </div>
            )}
          </div>

          <div className="product-detail__info">
            <h1 className="product-detail__title">{product.title}</h1>
            <p className="product-detail__artist">{product.artist}</p>

            <div className="product-detail__meta">
              {product.label && (
                <span className="product-detail__meta-item">
                  <strong>Gravadora:</strong> {product.label}
                </span>
              )}
              {product.releaseYear && (
                <span className="product-detail__meta-item">
                  <strong>Ano:</strong> {product.releaseYear}
                </span>
              )}
            </div>

            {product.genres && product.genres.length > 0 && (
              <div className="product-detail__genres">
                {product.genres.map((genre, index) => (
                  <span key={index} className="badge badge-genre">
                    {typeof genre === 'string' ? genre : genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="product-detail__price-section">
              <span className="product-detail__price">
                {formatPrice(product.price)}
              </span>
              <span className={`product-detail__stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
              </span>
            </div>

            <div className="product-detail__actions">
              <div className="product-detail__quantity">
                <button
                  className="product-detail__qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="product-detail__qty-value">{quantity}</span>
                <button
                  className="product-detail__qty-btn"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  disabled={quantity >= (product.stock || 99)}
                >
                  <FaPlus />
                </button>
              </div>

              <button
                className="btn btn-primary product-detail__add-cart"
                onClick={handleAddToCart}
                disabled={addingCart || product.stock <= 0}
              >
                <FaShoppingCart />
                {addingCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
              </button>

              <button
                className="btn btn-secondary product-detail__add-wishlist"
                onClick={handleAddToWishlist}
                disabled={addingWishlist}
              >
                <FaHeart />
                Adicionar a Wishlist
              </button>
            </div>

            {product.description && (
              <div className="product-detail__description">
                <h3>Descricao</h3>
                <p>{product.description}</p>
              </div>
            )}

            {product.tracklist && product.tracklist.length > 0 && (
              <div className="product-detail__tracklist">
                <h3>Tracklist</h3>
                <ol>
                  {product.tracklist.map((track, index) => (
                    <li key={index}>{track}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
