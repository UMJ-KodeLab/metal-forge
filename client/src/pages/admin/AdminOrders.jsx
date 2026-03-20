import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api, { API_BASE } from '../../services/api';
import './AdminOrders.css';

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Erro ao carregar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Status atualizado com sucesso!');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      toast.error('Erro ao atualizar status.');
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedId((prev) => (prev === orderId ? null : orderId));
  };

  const filtered = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h1 className="admin-page-title">Pedidos</h1>
        <div className="admin-orders-filter">
          <label>Filtrar por status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Status</th>
              <th>Total</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-table-empty">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <>
                  <tr key={order.id} className={expandedId === order.id ? 'row-expanded' : ''}>
                    <td>#{order.id}</td>
                    <td>
                      <div className="order-client">
                        <span>{order.user?.name || '---'}</span>
                        <small>{order.user?.email || ''}</small>
                      </div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`badge badge-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>R$ {Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <div className="admin-actions">
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => toggleExpand(order.id)}
                          title="Ver itens"
                        >
                          {expandedId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded order items */}
                  {expandedId === order.id && (
                    <tr key={`${order.id}-details`} className="order-details-row">
                      <td colSpan="6">
                        <div className="order-details">
                          <h4>Itens do Pedido</h4>
                          {order.items && order.items.length > 0 ? (
                            <table className="order-items-table">
                              <thead>
                                <tr>
                                  <th>Produto</th>
                                  <th>Qtd</th>
                                  <th>Preco Unit.</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      <div className="order-item-product">
                                        <img
                                          src={item.product?.coverImage ? `${API_BASE}${item.product.coverImage}` : '/placeholder.png'}
                                          alt={item.product?.title || 'Produto'}
                                          className="order-item-thumb"
                                        />
                                        <span>{item.product?.title || `Produto #${item.productId}`}</span>
                                      </div>
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>R$ {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td>R$ {(item.quantity * item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="dash-empty">Sem itens detalhados.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
