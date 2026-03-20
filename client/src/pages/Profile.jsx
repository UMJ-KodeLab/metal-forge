import { FaUser, FaEnvelope, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile page">
        <div className="container">
          <p className="profile__not-found">Usuario nao encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile page">
      <div className="container">
        <h1 className="page-title">Meu Perfil</h1>

        <div className="profile__card card">
          <div className="profile__avatar">
            <FaUser />
          </div>

          <div className="profile__details">
            <div className="profile__field">
              <FaUser className="profile__field-icon" />
              <div>
                <span className="profile__label">Nome</span>
                <p className="profile__value">{user.name}</p>
              </div>
            </div>

            <div className="profile__field">
              <FaEnvelope className="profile__field-icon" />
              <div>
                <span className="profile__label">Email</span>
                <p className="profile__value">{user.email}</p>
              </div>
            </div>

            <div className="profile__field">
              <FaShieldAlt className="profile__field-icon" />
              <div>
                <span className="profile__label">Tipo de conta</span>
                <p className="profile__value">
                  {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                </p>
              </div>
            </div>

            {user.createdAt && (
              <div className="profile__field">
                <FaCalendarAlt className="profile__field-icon" />
                <div>
                  <span className="profile__label">Membro desde</span>
                  <p className="profile__value">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
