import React, { useEffect, useState } from 'react';
import PostCard from '../components/social/PostCard';
import { PenSquare, Flame } from 'lucide-react';
// Imports de Firebase
import { db } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Forum = () => {
  const { user } = useAuth(); // Usuario logueado
  const [posts, setPosts] = useState([]); // Posts de la DB
  const [newPostContent, setNewPostContent] = useState(""); // Input del texto

  // 1. LEER POSTS EN TIEMPO REAL
  useEffect(() => {
    // Escuchamos la colección "posts" ordenada por fecha
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convertimos el Timestamp de Firebase a algo legible si existe, si no "Just now"
        time: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString() : "Just now"
      }));
      setPosts(postsData);
    });

    return () => unsubscribe(); // Limpiamos la suscripción al salir
  }, []);

  // 2. PUBLICAR NUEVO POST
  const handlePublish = async () => {
    if (!newPostContent.trim()) return;
    if (!user) {
      alert("Debes iniciar sesión para publicar");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        content: newPostContent,
        user: {
          name: user.displayName || "Usuario",
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`
        },
        handle: user.email ? user.email.split('@')[0] : "user",
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        retweets: 0,
        tag: "General"
      });
      setNewPostContent(""); // Limpiar input
    } catch (error) {
      console.error("Error publicando:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* COLUMNA IZQUIERDA (Menú) */}
        <div className="hidden lg:block col-span-1 p-4 border-r border-slate-800 sticky top-16 h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 px-2">Categorías</h2>
          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-full bg-blue-500/10 text-blue-400 font-bold">
              🏠 Para ti
            </button>
            <button className="w-full text-left px-4 py-3 rounded-full text-slate-300 hover:bg-slate-800">
              🔥 Tendencias
            </button>
          </nav>
        </div>

        {/* COLUMNA CENTRAL (Feed) */}
        <div className="col-span-1 lg:col-span-2 border-r border-slate-800 min-h-screen">
          
          {/* Input para postear */}
          <div className="sticky top-16 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4">
            <h1 className="text-xl font-bold mb-4 hidden md:block">Inicio</h1>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0"></div>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="¿Qué estás viendo/jugando hoy?" 
                  className="w-full bg-transparent text-xl placeholder-slate-500 outline-none border-none mb-4 text-white"
                />
                <div className="flex justify-end items-center">
                  <button 
                    onClick={handlePublish}
                    disabled={!newPostContent || !user}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full font-bold transition-all"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Posts Real */}
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
            {posts.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No hay publicaciones aún. ¡Sé el primero!
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA (Tendencias) */}
        <div className="hidden lg:block col-span-1 p-4 sticky top-16 h-fit">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Flame size={20} className="text-orange-500" /> Tendencias
            </h3>
            <div className="space-y-4">
              <div className="hover:bg-slate-800 p-2 rounded-lg cursor-pointer">
                <p className="text-xs text-slate-500">Videojuegos</p>
                <p className="font-bold">GTA VI</p>
              </div>
              <div className="hover:bg-slate-800 p-2 rounded-lg cursor-pointer">
                <p className="text-xs text-slate-500">Anime</p>
                <p className="font-bold">One Piece</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Botón flotante móvil */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button className="bg-blue-600 p-4 rounded-full shadow-lg text-white">
          <PenSquare size={24} />
        </button>
      </div>
    </div>
  );
};

export default Forum;