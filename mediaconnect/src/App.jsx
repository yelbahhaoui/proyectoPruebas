import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes de Estructura
import Navbar from './components/layout/Navbar';

// Páginas Principales
import Home from './pages/Home';
import Anime from './pages/Anime';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Games from './pages/Games';
import Forum from './pages/Forum';

// Páginas de Detalle y Usuario
import Details from './pages/Details';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Contextos
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    // 1. Envolvemos todo con el ThemeProvider para el modo oscuro/claro
    <ThemeProvider>
      <BrowserRouter>
        
        {/* 2. Este DIV principal controla el fondo de TODA la web según el tema */}
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300">
          
          <Navbar />
          
          <Routes>
            {/* Ruta Principal */}
            <Route path="/" element={<Home />} />
            
            {/* Listados Multimedia */}
            <Route path="/anime" element={<Anime />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/games" element={<Games />} />
            
            {/* Comunidad */}
            <Route path="/forum" element={<Forum />} />
            
            {/* Autenticación y Usuario */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* Fichas de Detalle Dinámicas */}
            <Route path="/movie/:id" element={<Details type="movie" />} />
            <Route path="/series/:id" element={<Details type="series" />} />
            <Route path="/game/:id" element={<Details type="game" />} />
            <Route path="/anime/:id" element={<Details type="anime" />} />
          </Routes>

        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;