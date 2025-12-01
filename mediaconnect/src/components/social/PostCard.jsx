import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share2, MoreHorizontal } from 'lucide-react';

const PostCard = ({ user, handle, time, content, image, initialLikes, comments, retweets, tag }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="border-b border-slate-800 p-4 hover:bg-slate-900/50 transition-colors cursor-pointer">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-12 h-12 rounded-full object-cover border border-slate-700"
          />
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 min-w-0">
          {/* Cabecera del Post */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white hover:underline">{user.name}</span>
              <span className="text-slate-500 text-sm">@{handle}</span>
              <span className="text-slate-600 text-sm">·</span>
              <span className="text-slate-500 text-sm hover:underline">{time}</span>
              {/* Etiqueta / Tag */}
              {tag && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  tag === 'Spoiler' ? 'bg-red-900/30 text-red-400' : 
                  tag === 'Teoría' ? 'bg-purple-900/30 text-purple-400' :
                  'bg-blue-900/30 text-blue-400'
                }`}>
                  {tag}
                </span>
              )}
            </div>
            <button className="text-slate-500 hover:text-blue-400">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Texto del Post */}
          <p className="text-slate-200 whitespace-pre-wrap mb-3 leading-relaxed">
            {content}
          </p>

          {/* Imagen opcional */}
          {image && (
            <div className="mb-3 rounded-xl overflow-hidden border border-slate-800">
              <img src={image} alt="Post content" className="w-full h-auto object-cover max-h-96" />
            </div>
          )}

          {/* Barra de Acciones (Likes, RT, Comentarios) */}
          <div className="flex items-center justify-between max-w-md text-slate-500">
            
            {/* Comentarios */}
            <button className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm">{comments}</span>
            </button>

            {/* Repost */}
            <button className="flex items-center gap-2 group hover:text-green-400 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-green-500/10">
                <Repeat size={18} />
              </div>
              <span className="text-sm">{retweets}</span>
            </button>

            {/* Like (Funcional) */}
            <button 
              onClick={(e) => { e.stopPropagation(); handleLike(); }}
              className={`flex items-center gap-2 group transition-colors ${liked ? 'text-pink-500' : 'hover:text-pink-500'}`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
              </div>
              <span className="text-sm">{likeCount}</span>
            </button>

            {/* Share */}
            <button className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                <Share2 size={18} />
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;