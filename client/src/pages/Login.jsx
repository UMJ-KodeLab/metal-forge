import LoginForm from '../components/Auth/LoginForm';
import './Login.css';

export default function Login() {
  return (
    <div className="login-page page">
      <div className="container">
        <h1 className="login-page__title">Entrar</h1>
        <LoginForm />
      </div>
    </div>
  );
}
