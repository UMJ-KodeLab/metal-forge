import { useState, useEffect } from 'react';
import { FaBox, FaShoppingBag, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';
import api, { API_BASE } from '../../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!stats) {
    return <p className="dash-error">Erro ao carregar dados do dashboard.</p>;
  }

  const cards = [
    {
      label: 'Total de Produtos',
      value: stats.totalProducts ?? 0,
      icon: <FaBox />,
      color: 'var(--accent)',
    },
    {
      label: 'Total de Pedidos',
      value: stats.totalOrders ?? 0,
      icon: <FaShoppingBag />,
      color: '#0074d9',
    },
    {
      label: 'Receita Total',
      value: `R$ ${(stats.totalRevenue ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: <FaDollarSign />,
      color: 'var(--success)',
    },
    {
      label: 'Estoque Baixo',
      value: stats.lowStockCount ?? 0,
      icon: <FaExclamationTriangle />,
      color: 'var(--warning)',
    },
  ];

  return (
    <div className="dashboard">
      <h1 className="admin-page-title">Dashboard</h1>

      {/* Stat Cards */}
      <div className="dash-cards">
        {cards.map((card) => (
          <div className="dash-card" key={card.label}>
            <div className="dash-card-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="dash-card-info">
              <span className="dash-card-value">{card.value}</span>
              <span className="dash-card-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <section className="dash-section">
        <h2>Pedidos Recentes</h2>
        {stats.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user?.name || order.user?.email || '---'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`badge badge-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>R$ {Number(order.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="dash-empty">Nenhum pedido recente.</p>
        )}
      </section>

      {/* Low Stock Alert */}
      <section className="dash-section">
        <h2>
          <FaExclamationTriangle style={{ color: 'var(--warning)', marginRight: 8 }} />
          Produtos com Estoque Baixo
        </h2>
        {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
          <div className="dash-low-stock">
            {stats.lowStockProducts.map((product) => (
              <div className="dash-low-stock-item" key={product.id}>
                <img
                  src={product.coverImage ? `${API_BASE}${product.coverImage}` : '/placeholder.png'}
                  alt={product.title}
                  className="dash-low-stock-img"
                />
                <div className="dash-low-stock-info">
                  <strong>{product.title}</strong>
                  <span>{product.artist}</span>
                </div>
                <span className="dash-low-stock-qty">
                  {product.stock} un.
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="dash-empty">Nenhum produto com estoque baixo.</p>
        )}
      </section>
    </div>
  );
}
