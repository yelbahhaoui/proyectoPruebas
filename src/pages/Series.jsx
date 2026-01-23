import React, { useEffect, useState } from 'react';
import { fetchPopularSeries, searchSeries } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';
import { Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'; 

const Series = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedSeries, setDisplayedSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const [page, setPage] = useState(1);
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  const genres = [
    { id: 10759, name: "Acción y Aventura" }, { id: 16, name: "Animación" },
    { id: 35, name: "Comedia" }, { id: 80, name: "Crimen" },
    { id: 18, name: "Drama" }, { id: 9648, name: "Misterio" },
    { id: 10765, name: "Sci-Fi & Fantasy" }, { id: 10768, name: "Guerra & Política" }
  ];

  const lastElementRef = useInfiniteScroll(() => {
    setPage(prev => prev + 1);
  }, loading);

  useEffect(() => { loadContent(page); }, [page]);

  useEffect(() => {
    let result = rawData;
    if (filters.genre) {
      const genreId = parseInt(filters.genre);
      result = result.filter(s => s.genre_ids && s.genre_ids.includes(genreId));
    }
    if (filters.year) {
      result = result.filter(s => s.first_air_date && s.first_air_date.startsWith(filters.year));
    }
    if (filters.minRating > 0) {
      result = result.filter(s => s.vote_average >= filters.minRating);
    }
    setDisplayedSeries(result);
  }, [rawData, filters]);

  const loadContent = async (pageNum) => {
    setLoading(true);

    if (pageNum > 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    const data = await fetchPopularSeries(pageNum);
    
    if (pageNum === 1) {
        setRawData(data || []);
    } else {
        setRawData(prev => [...prev, ...(data || [])]);
    }
    setLoading(false);
  };

  const handleSearch = async (query) => {
    if (!query) { setPage(1); loadContent(1); return; }
    const data = await searchSeries(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-purple-500 pl-4">Series de TV</h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedSeries.map((show, index) => (
            <MediaCard 
              key={`${show.id}-${index}`}
              id={show.id}
              title={show.name}
              image={show.poster_path ? `${IMAGE_BASE}${show.poster_path}` : 'https://via.placeholder.com/300x450'}
              rating={Math.round(show.vote_average * 10)}
              type="Serie TV"
            />
          ))}
      </div>

      <div ref={lastElementRef} className="h-24 flex items-center justify-center mt-8">
          {loading && (
             <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                <Loader2 className="animate-spin" size={32} />
                <span className="text-sm font-bold">Cargando más series...</span>
             </div>
          )}
      </div>
    </div>
  );
};

export default Series;