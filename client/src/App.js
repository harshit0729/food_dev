import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AIChatbot from './components/ai/AIChatbot';
import Loader from './components/ui/Loader';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import FoodDetail from './pages/FoodDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import AIFeatures from './pages/AIFeatures';
import MealPlanner from './pages/MealPlanner';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return children;
};

const AppLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <AIChatbot />
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
      <Route path="/register" element={<AppLayout><Register /></AppLayout>} />
      <Route path="/restaurants" element={<AppLayout><Restaurants /></AppLayout>} />
      <Route path="/restaurants/:id" element={<AppLayout><RestaurantDetail /></AppLayout>} />
      <Route path="/food/:id" element={<AppLayout><FoodDetail /></AppLayout>} />
      <Route path="/search" element={<AppLayout><SearchPage /></AppLayout>} />
      <Route path="/cart" element={<AppLayout><ProtectedRoute><CartPage /></ProtectedRoute></AppLayout>} />
      <Route path="/checkout" element={<AppLayout><ProtectedRoute><Checkout /></ProtectedRoute></AppLayout>} />
      <Route path="/orders" element={<AppLayout><ProtectedRoute><Orders /></ProtectedRoute></AppLayout>} />
      <Route path="/orders/:id" element={<AppLayout><ProtectedRoute><OrderDetail /></ProtectedRoute></AppLayout>} />
      <Route path="/profile" element={<AppLayout><ProtectedRoute><Profile /></ProtectedRoute></AppLayout>} />
      <Route path="/ai" element={<AppLayout><AIFeatures /></AppLayout>} />
      <Route path="/ai/chat" element={<AppLayout><AIFeatures /></AppLayout>} />
      <Route path="/ai/recommendations" element={<AppLayout><AIFeatures /></AppLayout>} />
      <Route path="/ai/meal-planner" element={<AppLayout><MealPlanner /></AppLayout>} />
      <Route path="/admin" element={<AppLayout><ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute></AppLayout>} />
      <Route path="/admin/users" element={<AppLayout><ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute></AppLayout>} />
      <Route path="/admin/restaurants" element={<AppLayout><ProtectedRoute adminOnly><AdminRestaurants /></ProtectedRoute></AppLayout>} />
      <Route path="/admin/menu" element={<AppLayout><ProtectedRoute adminOnly><AdminMenu /></ProtectedRoute></AppLayout>} />
      <Route path="/admin/orders" element={<AppLayout><ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute></AppLayout>} />
    </Routes>
  );
};

export default App;
