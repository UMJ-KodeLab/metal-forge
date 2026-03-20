import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import PaymentResult from './pages/PaymentResult';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminGenres from './pages/admin/AdminGenres';
import AdminOrders from './pages/admin/AdminOrders';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<><Header /><Home /><Footer /></>} />
      <Route path="/catalog" element={<><Header /><Catalog /><Footer /></>} />
      <Route path="/product/:id" element={<><Header /><ProductDetail /><Footer /></>} />
      <Route path="/login" element={<><Header /><Login /><Footer /></>} />
      <Route path="/register" element={<><Header /><Register /><Footer /></>} />

      {/* Payment results */}
      <Route path="/payment/:status" element={<><Header /><PaymentResult /><Footer /></>} />

      {/* Protected */}
      <Route path="/cart" element={<ProtectedRoute><Header /><CartPage /><Footer /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Header /><Checkout /><Footer /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Header /><Orders /><Footer /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Header /><Wishlist /><Footer /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Header /><Profile /><Footer /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="genres" element={<AdminGenres />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<><Header /><div className="page container" style={{ textAlign: 'center' }}><h1 className="page-title">404</h1><p>Pagina nao encontrada</p></div><Footer /></>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <ToastContainer position="bottom-right" theme="dark" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
