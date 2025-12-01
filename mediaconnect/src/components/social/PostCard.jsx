import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share2, MoreHorizontal } from 'lucide-react';

const PostCard = ({ user, handle, time, content, image, initialLikes, comments, retweets, tag }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes || 0);

  const handleLike = () => {
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setLiked(!liked);
  };

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img 
            src={user?.avatar} 
            alt={user?.name} 
            className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-white hover:underline">{user?.name}</span>
              <span className="text-slate-500 text-sm">@{handle}</span>
              <span className="text-slate-400 text-sm">·</span>
              <span className="text-slate-500 text-sm hover:underline">{time}</span>
              {tag && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {tag}
                </span>
              )}
            </div>
            <button className="text-slate-400 hover:text-blue-500">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap mb-3 leading-relaxed">
            {content}
          </p>

          {image && (
            <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img src={image} alt="Content" className="w-full h-auto object-cover max-h-96" />
            </div>
          )}

          {/* Botones Acción */}
          <div className="flex items-center justify-between max-w-md text-slate-500 dark:text-slate-500">
            <button className="flex items-center gap-2 group hover:text-blue-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10"><MessageCircle size={18} /></div>
              <span className="text-sm">{comments || 0}</span>
            </button>
            <button className="flex items-center gap-2 group hover:text-green-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-green-500/10"><Repeat size={18} /></div>
              <span className="text-sm">{retweets || 0}</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleLike(); }}
              className={`flex items-center gap-2 group transition-colors ${liked ? 'text-pink-500' : 'hover:text-pink-500'}`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-500/10"><Heart size={18} fill={liked ? "currentColor" : "none"} /></div>
              <span className="text-sm">{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;