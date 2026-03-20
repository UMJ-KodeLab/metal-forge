import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaBoxOpen } from 'react-icons/fa';
import api from '../services/api';
import './Orders.css';

const STATUS_MAP = {
  pending: 'badge-pending',
  paid: 'badge-paid',
  shipped: 'badge-shipped',
  delivered: 'badge-delivered',
  cancelled: 'badge-cancelled',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api
      .get('/orders')
      .then(({ data }) => {
        setOrders(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="orders page">
      <div className="container">
        <h1 className="page-title">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="orders__empty">
            <FaBoxOpen className="orders__empty-icon" />
            <h2>Nenhum pedido encontrado</h2>
            <p>Seus pedidos aparecerão aqui depois de sua primeira compra.</p>
          </div>
        ) : (
          <div className="orders__list">
            {orders.map((order) => (
              <div key={order.id} className="orders__card card">
                <div
                  className="orders__header"
                  onClick={() =>
                    setExpanded(expanded === order.id ? null : order.id)
                  }
                >
                  <div className="orders__info">
                    <span className="orders__id">Pedido #{order.id}</span>
                    <span className={`badge ${STATUS_MAP[order.status] || 'badge-pending'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="orders__details">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="orders__total">
                      {formatPrice(order.total)}
                    </span>
                    <span>{order.items?.length || 0} itens</span>
                    {expanded === order.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </div>

                {expanded === order.id && order.items && (
                  <div className="orders__items">
                    {order.items.map((item) => (
                      <div key={item.id} className="orders__item">
                        <span>
                          {item.Product?.title} - {item.Product?.artist}
                        </span>
                        <span>
                          {item.quantity}x {formatPrice(item.unitPrice)}
                        </span>
                      </div>
                    ))}
                    {order.shippingAddress && (
                      <div className="orders__address">
                        <strong>Endereco:</strong> {order.shippingAddress}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
