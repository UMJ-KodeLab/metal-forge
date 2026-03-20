import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMusic } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

export default function Checkout() {
  const { cart, total } = useCart();
  const { user } = useAuth();
  const [shippingAddress, setShippingAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      return toast.warning('Informe o endereco de entrega');
    }
    setProcessing(true);
    try {
      const { data: order } = await api.post('/orders', { shippingAddress });
      const { data: payment } = await api.post('/payment/create-preference', {
        orderId: order.id,
      });
      if (payment.init_point) {
        window.location.href = payment.init_point;
      } else {
        toast.success('Pedido criado! Redirecionando...');
        navigate('/orders');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao processar pagamento');
      setProcessing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout__layout">
          <div className="checkout__form">
            <h3>Endereco de Entrega</h3>
            <textarea
              rows="4"
              placeholder="Rua, numero, complemento, cidade, estado, CEP"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>

          <div className="checkout__summary card">
            <h3>Resumo do Pedido</h3>
            <div className="checkout__items">
              {cart.items.map((item) => (
                <div key={item.id} className="checkout__item">
                  <div className="checkout__item-image">
                    {item.Product?.coverImage ? (
                      <img src={item.Product.coverImage} alt="" />
                    ) : (
                      <div className="checkout__item-placeholder">
                        <FaMusic />
                      </div>
                    )}
                  </div>
                  <div className="checkout__item-info">
                    <span>{item.Product?.title}</span>
                    <small>
                      {item.quantity}x {formatPrice(item.Product?.price || 0)}
                    </small>
                  </div>
                  <span className="checkout__item-total">
                    {formatPrice(item.quantity * parseFloat(item.Product?.price || 0))}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout__total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              className="btn btn-primary checkout__pay-btn"
              onClick={handleCheckout}
              disabled={processing}
            >
              <FaCreditCard />
              {processing ? 'Processando...' : 'Pagar com MercadoPago'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
