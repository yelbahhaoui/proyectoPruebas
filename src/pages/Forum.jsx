import React, { useEffect, useState } from 'react';
import PostCard from '../components/social/PostCard';
import { PenSquare, Flame, User, MessageCircle, Home, Search, X } from 'lucide-react';
import { db } from '../services/firebase';
import { 
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, 
  deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, where, getDocs 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notifyFollowers, sendNotification } from '../services/notificationService';

const Forum = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [trends, setTrends] = useState([]);
  
  // Estados para el Buscador de Usuarios
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [isUserSearching, setIsUserSearching] = useState(false);
  
  // Estado para controlar la vista de Tendencias en Móvil
  const [showMobileTrends, setShowMobileTrends] = useState(false);

  // 1. LÓGICA DE BUSCADOR DE USUARIOS
  useEffect(() => {
    const searchUsers = async () => {
      if (!userSearchQuery.trim()) {
        setUserSearchResults([]);
        setIsUserSearching(false);
        return;
      }
      setIsUserSearching(true);
      try {
        const usersRef = collection(db, "users");
        // Búsqueda por rango (nombre que empieza por...)
        const q = query(
          usersRef, 
          where("displayName", ">=", userSearchQuery),
          where("displayName", "<=", userSearchQuery + '\uf8ff')
        );
        
        const snapshot = await getDocs(q);
        const results = snapshot.docs
          .map(doc => ({ uid: doc.id, ...doc.data() }))
          // Filtramos para no mostrarnos a nosotros mismos
          .filter(u => u.uid !== user?.uid); 
        
        setUserSearchResults(results);
      } catch (error) {
        console.error("Error buscando usuarios:", error);
      }
    };

    // Debounce de 300ms
    const delayDebounceFn = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [userSearchQuery, user]);

  const handleUserClick = (uid) => {
    navigate(`/user/${uid}`); // Ir al perfil público
    setUserSearchQuery("");    // Limpiar búsqueda
    setIsUserSearching(false);
  };

  // 2. LEER POSTS
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString() : "Just now"
      }));
      setPosts(postsData);
      calculateTrends(postsData);
    });
    return () => unsubscribe();
  }, []);

  const calculateTrends = (posts) => {
    const hashtags = {};
    posts.forEach(post => {
      const matches = post.content.match(/#[\w]+/g);
      if (matches) {
        matches.forEach(tag => { hashtags[tag] = (hashtags[tag] || 0) + 1; });
      }
    });
    const sortedTrends = Object.entries(hashtags)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
    
    setTrends(sortedTrends.length > 0 ? sortedTrends : [{ tag: "#MediaConnect", count: posts.length }]);
  };

  // 3. PUBLICAR
  const handlePublish = async () => {
    if (!newPostContent.trim()) return;
    if (!user) { alert("Debes iniciar sesión"); return; }
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        content: newPostContent,
        uid: user.uid,
        user: { name: user.displayName, avatar: user.photoURL },
        handle: user.email ? user.email.split('@')[0] : "user",
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0,
        retweets: 0,
        tag: "General"
      });

      // Notificar a seguidores
      await notifyFollowers(
          user.uid, 
          user, 
          'post', 
          'ha publicado algo nuevo.', 
          `/forum/post/${docRef.id}`
      );

      setNewPostContent("");
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("¿Eliminar post?")) {
      try { await deleteDoc(doc(db, "posts", postId)); } catch (error) { console.error(error); }
    }
  };

  const handleLike = async (post, likesArray) => {
    if (!user) return alert("Inicia sesión");
    const postRef = doc(db, "posts", post.id);
    const isLiked = likesArray.includes(user.uid);
    try {
      if (isLiked) {
          await updateDoc(postRef, { likes: arrayRemove(user.uid) });
      } else {
          await updateDoc(postRef, { likes: arrayUnion(user.uid) });

          // Notificar al dueño del post
          if (post.uid !== user.uid) {
              await sendNotification(
                  post.uid, 
                  'like', 
                  user, 
                  'le ha dado like a tu publicación.', 
                  `/forum/post/${post.id}`
              );
          }
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- COLUMNA IZQUIERDA (Navegación y Buscador) --- */}
        <div className="hidden lg:block col-span-1 p-4 border-r border-slate-200 dark:border-slate-800 sticky top-16 h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 px-2 text-slate-900 dark:text-white">Navegación</h2>
          <nav className="space-y-2">
            <button onClick={() => navigate('/')} className="w-full text-left px-4 py-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-bold">🏠 Inicio Web</button>
            <button onClick={() => window.scrollTo(0,0)} className="w-full text-left px-4 py-3 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold transition-colors">📰 Foro</button>
            <button onClick={() => navigate('/chat')} className="w-full text-left px-4 py-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">📩 Mensajes</button>
            <button onClick={() => navigate('/notifications')} className="w-full text-left px-4 py-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">🔔 Notificaciones</button>
            <button className="w-full text-left px-4 py-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">👤 Perfil</button>
          </nav>

          {/* --- BUSCADOR DE USUARIOS INTEGRADO --- */}
          <div className="mt-8 relative z-20">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-2 px-2">Buscar Personas</h3>
            <div className="px-2">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Buscar usuario..." 
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-9 pr-4 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
                </div>

                {/* LISTA DE RESULTADOS FLOTANTE */}
                {isUserSearching && (
                    <div className="absolute left-2 right-2 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        {userSearchResults.length > 0 ? (
                            userSearchResults.map(u => (
                                <div 
                                    key={u.uid} 
                                    onClick={() => handleUserClick(u.uid)}
                                    className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {u.photoURL ? (
                                            <img src={u.photoURL} alt={u.displayName} className="w-full h-full object-cover"/>
                                        ) : (
                                            <User size={16} className="text-slate-500"/>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{u.displayName}</p>
                                        <p className="text-[10px] text-slate-400 truncate">Ver perfil</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-500">
                                No se encontraron usuarios.
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>

        </div>

        {/* --- COLUMNA CENTRAL (Feed) --- */}
        <div className="col-span-1 lg:col-span-2 border-r border-slate-200 dark:border-slate-800 min-h-screen">
          {/* Header Móvil y Escritorio */}
          <div className="sticky top-16 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
            <h1 className="text-xl font-bold mb-4 hidden md:block text-slate-900 dark:text-white">Inicio</h1>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-sm">{user?.displayName?.[0] || <User size={18} />}</span>}
              </div>
              <div className="flex-1">
                <input type="text" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="¿Qué cuentas?" className="w-full bg-transparent text-xl placeholder-slate-400 outline-none border-none mb-4 dark:text-white" disabled={!user} />
                <div className="flex justify-end"><button onClick={handlePublish} disabled={!newPostContent || !user} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-full font-bold transition-all shadow-md">Publicar</button></div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div>
            {posts.map((post) => {
              const likes = post.likes || [];
              const isLiked = user ? likes.includes(user.uid) : false;
              const isMyPost = user && post.uid === user.uid;
              
              return (
                <div key={post.id} onClick={() => navigate(`/forum/post/${post.id}`)} className="cursor-pointer">
                    <PostCard 
                      {...post} 
                      user={isMyPost ? { name: user.displayName, avatar: user.photoURL } : post.user}
                      likesCount={likes.length}
                      isLiked={isLiked}
                      onLike={() => handleLike(post, likes)}
                      isOwner={isMyPost}
                      onDelete={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                    />
                </div>
              );
            })}
          </div>
        </div>

        {/* --- COLUMNA DERECHA (Tendencias Escritorio) --- */}
        <div className="hidden lg:block col-span-1 p-4 sticky top-16 h-fit">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white"><Flame size={20} className="text-orange-500" /> Tendencias</h3>
            <div className="space-y-4">
              {trends.map((trend, index) => (
                  <div key={index} className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg cursor-pointer transition-colors">
                    <p className="text-xs text-slate-500">Tendencia</p>
                    <p className="font-bold text-slate-900 dark:text-white">{trend.tag}</p>
                    <p className="text-xs text-slate-400">{trend.count} posts</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- BARRA DE NAVEGACIÓN MÓVIL --- */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center p-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button onClick={() => { window.scrollTo(0,0); setShowMobileTrends(false); }} className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 flex flex-col items-center">
            <Home size={24} />
            <span className="text-[10px] font-bold">Inicio</span>
        </button>
        
        <button onClick={() => setShowMobileTrends(!showMobileTrends)} className={`p-2 flex flex-col items-center ${showMobileTrends ? 'text-orange-500' : 'text-slate-600 dark:text-slate-400'}`}>
            <Search size={24} />
            <span className="text-[10px] font-bold">Explorar</span>
        </button>

        <button onClick={() => navigate('/chat')} className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 flex flex-col items-center relative">
            <MessageCircle size={24} />
            <span className="text-[10px] font-bold">Mensajes</span>
        </button>

        <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 flex flex-col items-center">
            <User size={24} />
            <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </div>

      {/* --- MODAL TENDENCIAS MÓVIL --- */}
      {showMobileTrends && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-slate-950 pt-20 px-4 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">Tendencias</h2>
                <button onClick={() => setShowMobileTrends(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X/></button>
            </div>
            <div className="space-y-4">
              {trends.map((trend, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500">Tendencia en MediaConnect</p>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{trend.tag}</p>
                    <p className="text-sm text-slate-400">{trend.count} posts</p>
                  </div>
              ))}
            </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE */}
      <div className="md:hidden fixed bottom-24 right-4 z-40">
        <button onClick={() => window.scrollTo(0,0)} className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full shadow-lg text-white transition-transform hover:scale-110 active:scale-90">
            <PenSquare size={24} />
        </button>
      </div>

    </div>
  );
};

export default Forum;