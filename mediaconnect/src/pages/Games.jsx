import React, { useEffect, useState } from 'react';
import { fetchPopularGames, searchGames } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';

const Games = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });

  // Lista manual de Slugs de géneros populares en RAWG
  const genres = [
    { id: "action", name: "Acción" }, { id: "adventure", name: "Aventura" },
    { id: "role-playing-games-rpg", name: "RPG" }, { id: "shooter", name: "Shooter" },
    { id: "indie", name: "Indie" }, { id: "strategy", name: "Estrategia" },
    { id: "sports", name: "Deportes" }, { id: "racing", name: "Carreras" }
  ];

  useEffect(() => { loadContent(); }, []);

  useEffect(() => {
    let result = rawData;
    // 1. Filtro Género (RAWG devuelve array de objetos, buscamos por slug)
    if (filters.genre) {
      result = result.filter(g => g.genres && g.genres.some(gen => gen.slug === filters.genre));
    }
    // 2. Filtro Año (released: "2023-05-12")
    if (filters.year) {
      result = result.filter(g => g.released && g.released.startsWith(filters.year));
    }
    // 3. Filtro Rating (Metacritic es 0-100, el slider es 0-10)
    if (filters.minRating > 0) {
      result = result.filter(g => (g.metacritic || 0) >= filters.minRating * 10);
    }
    setDisplayedGames(result);
  }, [rawData, filters]);

  const loadContent = async () => {
    setLoading(true);
    const data = await fetchPopularGames();
    setRawData(data || []);
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query) { loadContent(); return; }
    const data = await searchGames(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-green-500 pl-4">Videojuegos</h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />

      {loading ? <div className="text-white text-center py-20 animate-pulse">Cargando juegos...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedGames.map((game) => (
            <MediaCard 
              key={game.id}
              id={game.id}
              title={game.name}
              image={game.background_image}
              rating={game.metacritic || 0}
              type="Juego"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;