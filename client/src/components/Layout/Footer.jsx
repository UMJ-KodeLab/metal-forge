import { GiMetalBar } from 'react-icons/gi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <GiMetalBar className="footer-icon" />
          <span>Metal Forge</span>
          <p>O melhor do heavy metal em CD</p>
        </div>
        <div className="footer-links">
          <h4>Links</h4>
          <a href="/catalog">Catalogo</a>
          <a href="/about">Sobre</a>
        </div>
        <div className="footer-links">
          <h4>Contato</h4>
          <p>contato@metalforge.com</p>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Metal Forge. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
