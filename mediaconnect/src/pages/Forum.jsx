import React from 'react';
import PostCard from '../components/social/PostCard';
import { PenSquare, Flame, Hash } from 'lucide-react';

const Forum = () => {
  // DATOS FALSOS (MOCK DATA)
  const posts = [
    {
      id: 1,
      user: { name: "Alex Gamer", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
      handle: "alex_play",
      time: "2h",
      content: "¿Alguien más piensa que el final de Attack on Titan fue una obra maestra incomprendida? 🤯 Necesito debatir esto urgentemente.",
      tag: "Anime",
      initialLikes: 1420,
      comments: 342,
      retweets: 89,
      image: "https://wallpapers.com/images/hd/attack-on-titan-eren-yeager-founding-titan-q9d9d9d9.jpg" // Imagen placeholder
    },
    {
      id: 2,
      user: { name: "Cinéfilo Pro", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
      handle: "cine_master",
      time: "4h",
      content: "Acabo de ver Dune Parte 2. Simplemente CINE. La fotografía, la banda sonora... Hans Zimmer lo hizo de nuevo. 10/10 sin dudas.",
      tag: "Review",
      initialLikes: 5600,
      comments: 890,
      retweets: 1200,
    },
    {
      id: 3,
      user: { name: "Sarah Connor", avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d" },
      handle: "skynet_hater",
      time: "5h",
      content: "⚠️ SPOILERS DE FALLOUT (SERIE) ⚠️\n\nNo me esperaba para nada lo que pasa en el Refugio 31. ¿Creéis que en la segunda temporada veremos New Vegas?",
      tag: "Spoiler",
      initialLikes: 340,
      comments: 120,
      retweets: 45,
    },
    {
      id: 4,
      user: { name: "Nintendo Fan", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
      handle: "mario_luigi",
      time: "1d",
      content: "Llevo 50 horas en Elden Ring y todavía no sé qué estoy haciendo, pero me encanta morir una y otra vez. ¿Algún consejo para Malenia?",
      tag: "Juegos",
      initialLikes: 230,
      comments: 89,
      retweets: 12,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* COLUMNA IZQUIERDA - Navegación/Info (Solo visible en desktop grande) */}
        <div className="hidden lg:block col-span-1 p-4 border-r border-slate-800 sticky top-16 h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 px-2">Categorías</h2>
          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-full bg-blue-500/10 text-blue-400 font-bold hover:bg-blue-500/20 transition-colors">
              🏠 Para ti
            </button>
            <button className="w-full text-left px-4 py-3 rounded-full text-slate-300 hover:bg-slate-800 transition-colors">
              🔥 Tendencias
            </button>
            <button className="w-full text-left px-4 py-3 rounded-full text-slate-300 hover:bg-slate-800 transition-colors">
              🎬 Cine & Series
            </button>
            <button className="w-full text-left px-4 py-3 rounded-full text-slate-300 hover:bg-slate-800 transition-colors">
              🎮 Gaming
            </button>
            <button className="w-full text-left px-4 py-3 rounded-full text-slate-300 hover:bg-slate-800 transition-colors">
              ⛩️ Anime
            </button>
          </nav>
        </div>

        {/* COLUMNA CENTRAL - El Feed */}
        <div className="col-span-1 lg:col-span-2 border-r border-slate-800 min-h-screen">
          
          {/* Cabecera del Feed + Input para postear */}
          <div className="sticky top-16 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4">
            <h1 className="text-xl font-bold mb-4 hidden md:block">Inicio</h1>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0"></div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="¿Qué estás viendo/jugando hoy?" 
                  className="w-full bg-transparent text-xl placeholder-slate-500 outline-none border-none mb-4"
                />
                <div className="flex justify-between items-center">
                  <div className="text-blue-500 flex gap-4 text-sm font-bold">
                    {/* Iconos de adjuntar (falsos) */}
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold transition-all disabled:opacity-50">
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Posts */}
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>

          {/* Loader al final */}
          <div className="p-8 text-center text-slate-500">
            Cargando más posts...
          </div>
        </div>

        {/* COLUMNA DERECHA - Tendencias */}
        <div className="hidden lg:block col-span-1 p-4 sticky top-16 h-fit">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Flame size={20} className="text-orange-500" /> Tendencias hoy
            </h3>
            <div className="space-y-4">
              <div className="hover:bg-slate-800 p-2 -mx-2 rounded-lg cursor-pointer transition-colors">
                <p className="text-xs text-slate-500">Videojuegos · Tendencia</p>
                <p className="font-bold">GTA VI Trailer 2</p>
                <p className="text-xs text-slate-500">125K posts</p>
              </div>
              <div className="hover:bg-slate-800 p-2 -mx-2 rounded-lg cursor-pointer transition-colors">
                <p className="text-xs text-slate-500">Anime · En vivo</p>
                <p className="font-bold">One Piece 1100</p>
                <p className="text-xs text-slate-500">54K posts</p>
              </div>
              <div className="hover:bg-slate-800 p-2 -mx-2 rounded-lg cursor-pointer transition-colors">
                <p className="text-xs text-slate-500">Cine · Estreno</p>
                <p className="font-bold">Joker 2</p>
                <p className="text-xs text-slate-500">89K posts</p>
              </div>
            </div>
          </div>

          {/* Footer pequeño */}
          <div className="text-xs text-slate-500 px-2">
            © 2024 MediaConnect Inc.
          </div>
        </div>

      </div>

      {/* Botón flotante para móvil */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button className="bg-blue-600 p-4 rounded-full shadow-lg shadow-blue-600/30 text-white hover:scale-110 transition-transform">
          <PenSquare size={24} />
        </button>
      </div>
    </div>
  );
};

export default Forum;