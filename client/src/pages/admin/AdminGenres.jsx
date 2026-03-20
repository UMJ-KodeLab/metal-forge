import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './AdminGenres.css';

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const { data } = await api.get('/genres');
      setGenres(data);
    } catch (err) {
      toast.error('Erro ao carregar generos.');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setShowModal(true);
  };

  const openEdit = (genre) => {
    setEditingId(genre.id);
    setName(genre.name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    try {
      const payload = { name: name.trim() };

      if (editingId) {
        await api.put(`/genres/${editingId}`, payload);
        toast.success('Genero atualizado com sucesso!');
      } else {
        await api.post('/genres', payload);
        toast.success('Genero criado com sucesso!');
      }

      closeModal();
      fetchGenres();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar genero.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (genre) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${genre.name}"?`)) return;

    try {
      await api.delete(`/genres/${genre.id}`);
      toast.success('Genero excluido com sucesso!');
      fetchGenres();
    } catch (err) {
      toast.error('Erro ao excluir genero.');
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
    <div className="admin-genres">
      <div className="admin-genres-header">
        <h1 className="admin-page-title">Generos</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Novo Genero
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {genres.length === 0 ? (
              <tr>
                <td colSpan="3" className="admin-table-empty">
                  Nenhum genero encontrado.
                </td>
              </tr>
            ) : (
              genres.map((genre) => (
                <tr key={genre.id}>
                  <td>{genre.name}</td>
                  <td>
                    <code className="genre-slug">{genre.slug}</code>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(genre)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(genre)} title="Excluir">
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
          <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Editar Genero' : 'Novo Genero'}</h2>
              <button className="admin-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Nome *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Thrash Metal"
                  required
                  autoFocus
                />
              </div>

              {name.trim() && (
                <div className="genre-slug-preview">
                  <span>Slug:</span>
                  <code>{generateSlug(name)}</code>
                </div>
              )}

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
