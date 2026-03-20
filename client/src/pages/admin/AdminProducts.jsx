import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './AdminProducts.css';

const emptyForm = {
  title: '',
  artist: '',
  description: '',
  price: '',
  stock: '',
  releaseYear: '',
  label: '',
  coverImage: null,
  tracklist: '',
  genreIds: [],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, genreRes] = await Promise.all([
        api.get('/products'),
        api.get('/genres'),
      ]);
      setProducts(prodRes.data.products || prodRes.data);
      setGenres(genreRes.data);
    } catch (err) {
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title || '',
      artist: product.artist || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      releaseYear: product.releaseYear || '',
      label: product.label || '',
      coverImage: null,
      tracklist: product.tracklist ? product.tracklist.join('\n') : '',
      genreIds: product.genres ? product.genres.map((g) => g.id) : [],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGenreToggle = (genreId) => {
    setForm((prev) => {
      const ids = prev.genreIds.includes(genreId)
        ? prev.genreIds.filter((id) => id !== genreId)
        : [...prev.genreIds, genreId];
      return { ...prev, genreIds: ids };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('artist', form.artist);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      if (form.releaseYear) formData.append('releaseYear', form.releaseYear);
      if (form.label) formData.append('label', form.label);
      if (form.coverImage) formData.append('coverImage', form.coverImage);

      const tracks = form.tracklist
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);
      tracks.forEach((track) => formData.append('tracklist', track));
      form.genreIds.forEach((id) => formData.append('genreIds', id));

      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Produto criado com sucesso!');
      }

      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar produto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${product.title}"?`)) return;

    try {
      await api.delete(`/products/${product.id}`);
      toast.success('Produto excluido com sucesso!');
      fetchData();
    } catch (err) {
      toast.error('Erro ao excluir produto.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <h1 className="admin-page-title">Produtos</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Novo CD
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Capa</th>
              <th>Titulo</th>
              <th>Artista</th>
              <th>Preco</th>
              <th>Estoque</th>
              <th>Generos</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="admin-table-empty">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.coverImage || '/placeholder.png'}
                      alt={product.title}
                      className="admin-products-thumb"
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.artist}</td>
                  <td>R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={product.stock <= 5 ? 'stock-low' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="admin-products-genres">
                      {product.genres?.map((g) => (
                        <span key={g.id} className="genre-tag">{g.name}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(product)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product)} title="Excluir">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Editar Produto' : 'Novo CD'}</h2>
              <button className="admin-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Titulo *</label>
                  <input name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="admin-form-group">
                  <label>Artista *</label>
                  <input name="artist" value={form.artist} onChange={handleChange} required />
                </div>
                <div className="admin-form-group">
                  <label>Preco *</label>
                  <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
                </div>
                <div className="admin-form-group">
                  <label>Estoque *</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
                </div>
                <div className="admin-form-group">
                  <label>Ano de Lancamento</label>
                  <input name="releaseYear" type="number" min="1950" max="2030" value={form.releaseYear} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                  <label>Gravadora</label>
                  <input name="label" value={form.label} onChange={handleChange} />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Descricao</label>
                <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
              </div>

              <div className="admin-form-group">
                <label>Imagem de Capa</label>
                <input name="coverImage" type="file" accept="image/*" onChange={handleChange} />
              </div>

              <div className="admin-form-group">
                <label>Tracklist (uma faixa por linha)</label>
                <textarea name="tracklist" rows="5" value={form.tracklist} onChange={handleChange} placeholder="1. Track Name&#10;2. Another Track" />
              </div>

              <div className="admin-form-group">
                <label>Generos</label>
                <div className="admin-genre-checkboxes">
                  {genres.map((genre) => (
                    <label key={genre.id} className="admin-checkbox">
                      <input
                        type="checkbox"
                        checked={form.genreIds.includes(genre.id)}
                        onChange={() => handleGenreToggle(genre.id)}
                      />
                      <span>{genre.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
