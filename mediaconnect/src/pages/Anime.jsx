import React, { useEffect, useState } from 'react';
import { fetchTrendingAnime, searchAnime } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';

const Anime = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedAnime, setDisplayedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });

  // Lista de géneros (Strings directos para AniList)
  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
    "Horror", "Mecha", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports"
  ].map(g => ({ id: g, name: g })); // Adaptamos formato para que FilterBar lo lea

  useEffect(() => { loadContent(); }, []);

  useEffect(() => {
    let result = rawData;
    // 1. Filtro Género (Array de Strings)
    if (filters.genre) {
      result = result.filter(a => a.genres && a.genres.includes(filters.genre));
    }
    // 2. Filtro Año (startDate.year es un entero)
    if (filters.year) {
      result = result.filter(a => a.startDate && a.startDate.year == filters.year);
    }
    // 3. Filtro Rating (AverageScore es 0-100)
    if (filters.minRating > 0) {
      result = result.filter(a => (a.averageScore || 0) >= filters.minRating * 10);
    }
    setDisplayedAnime(result);
  }, [rawData, filters]);

  const loadContent = async () => {
    setLoading(true);
    const data = await fetchTrendingAnime();
    setRawData(data || []);
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query) { loadContent(); return; }
    const data = await searchAnime(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">Anime</h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />

      {loading ? <div className="text-white text-center py-20 animate-pulse">Cargando anime...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedAnime.map((anime) => (
            <MediaCard 
              key={anime.id}
              id={anime.id}
              title={anime.title.english || anime.title.romaji}
              image={anime.coverImage.large}
              rating={anime.averageScore}
              type="Anime"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Anime;