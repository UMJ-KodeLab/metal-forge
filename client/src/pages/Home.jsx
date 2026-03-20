import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiMetalBar } from 'react-icons/gi';
import { FaCompactDisc } from 'react-icons/fa';
import api from '../services/api';
import ProductList from '../components/Product/ProductList';
import './Home.css';

export default function Home() {
  const [latest, setLatest] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [latestRes, featuredRes] = await Promise.all([
          api.get('/products?limit=8'),
          api.get('/products?limit=4&sort=random'),
        ]);
        setLatest(latestRes.data.products || latestRes.data);
        setFeatured(featuredRes.data.products || featuredRes.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content container">
          <GiMetalBar className="hero__icon" />
          <h1 className="hero__title">Metal Forge</h1>
          <p className="hero__tagline">O melhor do heavy metal em CD</p>
          <Link to="/catalog" className="btn btn-primary hero__cta">
            <FaCompactDisc />
            Ver Catalogo
          </Link>
        </div>
      </section>

      <section className="home__section container">
        <h2 className="home__section-title">Novidades</h2>
        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : (
          <ProductList products={latest} />
        )}
      </section>

      <section className="home__section container">
        <h2 className="home__section-title">Destaques</h2>
        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : (
          <ProductList products={featured} />
        )}
      </section>
    </div>
  );
}
