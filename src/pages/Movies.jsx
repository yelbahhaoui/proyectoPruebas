import React, { useEffect, useState } from 'react';
import { fetchPopularMovies, searchMovies } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';
import { Loader2 } from 'lucide-react'; // Cambiado icono
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'; // <--- IMPORTADO

const Movies = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const [page, setPage] = useState(1);
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  const genres = [
    { id: 28, name: "Acción" }, { id: 12, name: "Aventura" },
    { id: 16, name: "Animación" }, { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" }, { id: 18, name: "Drama" },
    { id: 10751, name: "Familia" }, { id: 14, name: "Fantasía" },
    { id: 27, name: "Terror" }, { id: 878, name: "Ciencia Ficción" }
  ];

  // 1. Hook de Scroll Infinito
  const lastElementRef = useInfiniteScroll(() => {
    setPage(prev => prev + 1);
  }, loading);

  useEffect(() => { loadContent(page); }, [page]);

  useEffect(() => {
    let result = rawData;
    if (filters.genre) result = result.filter(m => m.genre_ids && m.genre_ids.includes(parseInt(filters.genre)));
    if (filters.year) result = result.filter(m => m.release_date && m.release_date.startsWith(filters.year));
    if (filters.minRating > 0) result = result.filter(m => m.vote_average >= filters.minRating);
    setDisplayedMovies(result);
  }, [rawData, filters]);

  const loadContent = async (pageNum) => {
    setLoading(true);
    
    // --- DELAY ARTIFICIAL (1 segundo) ---
    if (pageNum > 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    // ------------------------------------

    const data = await fetchPopularMovies(pageNum);
    
    if (pageNum === 1) {
      setRawData(data || []);
    } else {
      setRawData(prev => [...prev, ...(data || [])]);
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query) { setPage(1); loadContent(1); return; }
    const data = await searchMovies(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-red-500 pl-4">
        Películas
      </h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedMovies.map((movie, index) => (
            <MediaCard 
              key={`${movie.id}-${index}`} // Key única usando index por si acaso
              id={movie.id}
              title={movie.title}
              image={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/300x450'}
              rating={Math.round(movie.vote_average * 10)}
              type="Película"
            />
          ))}
      </div>
      
      {/* ELEMENTO CENTINELA (Invisible hasta llegar al final) */}
      <div ref={lastElementRef} className="h-24 flex items-center justify-center mt-8">
          {loading && (
             <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                <Loader2 className="animate-spin" size={32} />
                <span className="text-sm font-bold">Cargando más películas...</span>
             </div>
          )}
      </div>
    </div>
  );
};

export default Movies;