import React, { useEffect, useState } from 'react';
import { fetchPopularSeries, searchSeries } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';

const Series = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedSeries, setDisplayedSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  // IDs de géneros de TV en TMDB (son diferentes a los de Películas)
  const genres = [
    { id: 10759, name: "Acción y Aventura" }, { id: 16, name: "Animación" },
    { id: 35, name: "Comedia" }, { id: 80, name: "Crimen" },
    { id: 18, name: "Drama" }, { id: 9648, name: "Misterio" },
    { id: 10765, name: "Sci-Fi & Fantasy" }, { id: 10768, name: "Guerra & Política" }
  ];

  useEffect(() => { loadContent(); }, []);

  useEffect(() => {
    let result = rawData;
    // 1. Filtro Género
    if (filters.genre) {
      const genreId = parseInt(filters.genre);
      result = result.filter(s => s.genre_ids && s.genre_ids.includes(genreId));
    }
    // 2. Filtro Año (first_air_date: "2023-01-15")
    if (filters.year) {
      result = result.filter(s => s.first_air_date && s.first_air_date.startsWith(filters.year));
    }
    // 3. Filtro Rating (0-10)
    if (filters.minRating > 0) {
      result = result.filter(s => s.vote_average >= filters.minRating);
    }
    setDisplayedSeries(result);
  }, [rawData, filters]);

  const loadContent = async () => {
    setLoading(true);
    const data = await fetchPopularSeries();
    setRawData(data || []);
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query) { loadContent(); return; }
    const data = await searchSeries(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">Series de TV</h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />

      {loading ? <div className="text-white text-center py-20 animate-pulse">Cargando series...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedSeries.map((show) => (
            <MediaCard 
              key={show.id}
              id={show.id}
              title={show.name}
              image={show.poster_path ? `${IMAGE_BASE}${show.poster_path}` : 'https://via.placeholder.com/300x450'}
              rating={Math.round(show.vote_average * 10)}
              type="Serie TV"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Series;