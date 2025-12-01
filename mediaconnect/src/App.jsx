import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Anime from './pages/Anime';
// Importamos las nuevas páginas
import Movies from './pages/Movies';
import Series from './pages/Series';
import Games from './pages/Games';
import Forum from './pages/Forum';
import Details from './pages/Details';

const Placeholder = ({ title }) => (
  <div className="text-white text-center py-20 text-2xl">
    Página de {title} en construcción 🚧
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Rutas Multimedia */}
          <Route path="/anime" element={<Anime />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/games" element={<Games />} />
          <Route path="/forum" element={<Forum />} />

          {/* NUEVAS RUTAS DE DETALLE */}
          <Route path="/movie/:id" element={<Details type="movie" />} />
          <Route path="/series/:id" element={<Details type="series" />} />
          <Route path="/game/:id" element={<Details type="game" />} />
          <Route path="/anime/:id" element={<Details type="anime" />} />

          <Route path="/register" element={<Placeholder title="Registro" />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
};

export default App;