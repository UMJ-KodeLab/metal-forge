import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import ProductList from '../components/Product/ProductList';
import './Catalog.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preco' },
  { value: 'price_desc', label: 'Maior preco' },
  { value: 'title_asc', label: 'A-Z' },
];

const LIMIT = 12;

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/genres').then((res) => {
      setGenres(res.data);
    }).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', LIMIT);
      if (search) params.set('search', search);
      if (selectedGenres.length === 1) {
        const g = genres.find(gen => gen.id === selectedGenres[0]);
        if (g) params.set('genre', g.slug);
      }
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);

      const sortMap = {
        newest: { orderBy: 'created_at', order: 'DESC' },
        price_asc: { orderBy: 'price', order: 'ASC' },
        price_desc: { orderBy: 'price', order: 'DESC' },
        title_asc: { orderBy: 'title', order: 'ASC' },
      };
      const s = sortMap[sort] || sortMap.newest;
      params.set('orderBy', s.orderBy);
      params.set('order', s.order);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || data);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedGenres, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (search) {
      newParams.set('search', search);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedGenres([]);
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="catalog page">
      <div className="container">
        <h1 className="page-title">Catalogo</h1>

        <button
          className="catalog__filter-toggle btn btn-secondary"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaFilter /> Filtros
        </button>

        <div className="catalog__layout">
          <aside className={`catalog__sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="catalog__sidebar-header">
              <h3>Filtros</h3>
              <button
                className="catalog__sidebar-close"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form className="catalog__search" onSubmit={handleSearch}>
              <div className="catalog__search-input-wrapper">
                <input
                  type="text"
                  placeholder="Buscar CDs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="catalog__search-btn">
                  <FaSearch />
                </button>
              </div>
            </form>

            <div className="catalog__filter-group">
              <h4>Generos</h4>
              <div className="catalog__genre-list">
                {genres.map((genre) => (
                  <label key={genre.id} className="catalog__genre-item">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.id)}
                      onChange={() => toggleGenre(genre.id)}
                    />
                    <span>{genre.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="catalog__filter-group">
              <h4>Faixa de Preco</h4>
              <div className="catalog__price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                  min="0"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                  min="0"
                />
              </div>
            </div>

            <button className="btn btn-secondary catalog__clear-btn" onClick={clearFilters}>
              Limpar Filtros
            </button>
          </aside>

          <main className="catalog__main">
            <div className="catalog__toolbar">
              <span className="catalog__results-count">
                {loading ? 'Buscando...' : `${totalCount} resultados`}
              </span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="catalog__sort"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner" />
              </div>
            ) : (
              <ProductList products={products} />
            )}

            {totalPages > 1 && (
              <div className="catalog__pagination">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </button>
                <span className="catalog__page-info">
                  Pagina {page} de {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Proxima
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
