import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MessageSquare, Send } from 'lucide-react';
import { authService } from '../../../../services/auth.api';

const TopicComments = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user] = useState(authService.obtenerUsuarioActual());

  // Cargar comentarios del localStorage al montar
  useEffect(() => {
    const storageKey = `topic-comments-${topicId}`;
    const savedComments = localStorage.getItem(storageKey);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch {
        setComments([]);
      }
    }
  }, [topicId]);

  // Guardar comentarios en localStorage cuando cambien
  useEffect(() => {
    const storageKey = `topic-comments-${topicId}`;
    if (comments.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    }
  }, [comments, topicId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: {
        id: user?.id || 0,
        nombre: user?.nombre || 'Usuario',
        email: user?.email || '',
      },
      createdAt: new Date().toISOString(),
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Comentarios del profesor</h2>
        <span className="text-sm text-slate-500 ml-2">({comments.length})</span>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Form para agregar comentario */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="flex items-start gap-3">
            {/* Avatar del usuario actual */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.nombre}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user?.nombre || 'U')
                )}
              </div>
            </div>

            {/* Input de comentario */}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario o nota sobre este tópico..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all"
                rows="3"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">
                  {newComment.length} caracteres
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Comentar
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Divider */}
        {comments.length > 0 && (
          <div className="border-t border-slate-700/50"></div>
        )}

        {/* Lista de comentarios */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Aún no hay comentarios</p>
              <p className="text-slate-600 text-xs mt-1">Sé el primero en agregar una nota</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all"
              >
                {/* Avatar del autor */}
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-xs">
                    {comment.author.profilePicture ? (
                      <img 
                        src={comment.author.profilePicture} 
                        alt={comment.author.nombre}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(comment.author.nombre)
                    )}
                  </div>
                </div>

                {/* Contenido del comentario */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {comment.author.nombre}
                      </span>
                      {comment.author.id === user?.id && (
                        <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full">
                          Tú
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm whitespace-pre-wrap break-words">
                    {comment.text}
                  </p>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

TopicComments.propTypes = {
  topicId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TopicComments;
