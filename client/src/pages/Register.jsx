import RegisterForm from '../components/Auth/RegisterForm';
import './Register.css';

export default function Register() {
  return (
    <div className="register-page page">
      <div className="container">
        <h1 className="register-page__title">Criar Conta</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
