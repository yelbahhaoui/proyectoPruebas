import React, { useEffect, useState } from 'react';
import { fetchPopularMovies, searchMovies } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';

const Movies = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  const genres = [
    { id: 28, name: "Acción" }, { id: 12, name: "Aventura" },
    { id: 16, name: "Animación" }, { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" }, { id: 18, name: "Drama" },
    { id: 10751, name: "Familia" }, { id: 14, name: "Fantasía" },
    { id: 27, name: "Terror" }, { id: 878, name: "Ciencia Ficción" }
  ];

  useEffect(() => { loadContent(); }, []);

  useEffect(() => {
    let result = rawData;
    if (filters.genre) result = result.filter(m => m.genre_ids && m.genre_ids.includes(parseInt(filters.genre)));
    if (filters.year) result = result.filter(m => m.release_date && m.release_date.startsWith(filters.year));
    if (filters.minRating > 0) result = result.filter(m => m.vote_average >= filters.minRating);
    setDisplayedMovies(result);
  }, [rawData, filters]);

  const loadContent = async () => {
    setLoading(true);
    const data = await fetchPopularMovies();
    setRawData(data || []);
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query) { loadContent(); return; }
    const data = await searchMovies(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* CAMBIO AQUÍ: text-slate-900 dark:text-white */}
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-red-500 pl-4">
        Películas
      </h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />
      
      {loading ? (
        <div className="text-slate-600 dark:text-white text-center py-20 animate-pulse">Cargando cartelera...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedMovies.map((movie) => (
            <MediaCard 
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/300x450'}
              rating={Math.round(movie.vote_average * 10)}
              type="Película"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;