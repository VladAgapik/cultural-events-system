import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import FavoritesPage from './pages/FavoritesPage';
import CategoryPage from './pages/CategoryPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CategoryEventsPage from './pages/CategoryEventsPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/categories/:categoryKey" element={<CategoryEventsPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;