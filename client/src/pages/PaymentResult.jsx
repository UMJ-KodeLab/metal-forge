import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClock, FaBoxOpen } from 'react-icons/fa';
import './PaymentResult.css';

const STATUS_CONFIG = {
  success: {
    icon: FaCheckCircle,
    title: 'Pagamento Aprovado!',
    message: 'Seu pagamento foi processado com sucesso. Obrigado pela compra!',
    className: 'payment-result--success',
  },
  failure: {
    icon: FaTimesCircle,
    title: 'Pagamento Recusado',
    message: 'Infelizmente seu pagamento nao foi aprovado. Tente novamente ou use outro metodo de pagamento.',
    className: 'payment-result--failure',
  },
  pending: {
    icon: FaClock,
    title: 'Pagamento Pendente',
    message: 'Seu pagamento esta sendo processado. Voce sera notificado quando for aprovado.',
    className: 'payment-result--pending',
  },
};

export default function PaymentResult() {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const status = pathParts[pathParts.length - 1];

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <div className={`payment-result page ${config.className}`}>
      <div className="container">
        <div className="payment-result__card">
          <Icon className="payment-result__icon" />
          <h1 className="payment-result__title">{config.title}</h1>
          <p className="payment-result__message">{config.message}</p>
          <div className="payment-result__actions">
            <Link to="/orders" className="btn btn-primary">
              <FaBoxOpen /> Ver Meus Pedidos
            </Link>
            <Link to="/catalog" className="btn btn-secondary">
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
