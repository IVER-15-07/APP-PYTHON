import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MessageSquare, Send, Reply } from 'lucide-react';
import { authService } from '../../../../services/auth.api';
import { commentService } from '../../../../services/comments';
import { onNewComment, onCommentAnswered, onCommentsFetched } from '../../../../services/socketComment.service.js';


const TopicComments = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [user] = useState(authService.obtenerUsuarioActual());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Cargar comentarios del backend al montar
  useEffect(() => {
    const fetchComments = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await commentService.getComentarios(user.id);
        const commentsData = response?.data || [];
        // Filtrar comentarios solo de este tópico y ordenar por fecha (más recientes primero)
        const topicComments = commentsData
          .filter(c => c.topicoId === Number(topicId))
          .sort((a, b) => new Date(b.fecha_pub) - new Date(a.fecha_pub));
        setComments(topicComments);
      } catch {
        setError('No se pudieron cargar los comentarios');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [topicId, user?.id]);

  // Suscribirse a eventos WebSocket
  useEffect(() => {
    if (!user?.id) return;

    const handleNewComment = (data) => {
      console.log('WebSocket - Nuevo comentario:', data);
      if (data.comment?.topicoId === Number(topicId)) {
        setComments(prev => {
          // Evitar duplicados
          const exists = prev.some(c => c.id === data.comment.id);
          if (exists) return prev;
          return [data.comment, ...prev];
        });
      }
    };

    const handleCommentAnswered = (data) => {
      console.log('WebSocket - Respuesta recibida:', data);
      if (data.answer) {
        setComments(prev => prev.map(comment => {
          if (comment.id === data.answer.comentarioId) {
            // Evitar duplicados
            const exists = comment.respuestas?.some(r => r.id === data.answer.id);
            if (exists) return comment;
            return {
              ...comment,
              respuestas: [...(comment.respuestas || []), data.answer]
            };
          }
          return comment;
        }));
      }
    };

    const handleCommentsFetched = (data) => {
      console.log('WebSocket - Comentarios cargados:', data);
      if (data.comments) {
        const topicComments = data.comments.filter(c => c.topicoId === Number(topicId));
        setComments(topicComments);
      }
    };

    // Suscribir a eventos
    onNewComment(handleNewComment);
    onCommentAnswered(handleCommentAnswered);
    onCommentsFetched(handleCommentsFetched);

    // Cleanup: remover listeners al desmontar
    return () => {
      // Socket.io no permite remover listeners individuales fácilmente
      // pero los callbacks se limpiarán con el desmontaje del componente
    };
  }, [topicId, user?.id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user?.id) return;

    setSubmitting(true);
    setError(null);

    try {
      const commentData = {
        contenido: newComment.trim(),
        usuarioId: user.id,
        topicoId: Number(topicId),
      };

      const response = await commentService.crearComentario(commentData);
      
      // El comentario se agregará automáticamente por WebSocket
      // pero lo agregamos de inmediato para mejor UX
      const newCommentObj = {
        id: response.data.id,
        contenido: newComment.trim(),
        fecha_pub: new Date().toISOString(),
        topicoId: Number(topicId),
        usuarioId: user.id,
        usuario: {
          nombre: user.nombre,
          profilePicture: user.profilePicture
        },
        respuestas: []
      };

      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
    } catch (err) {
      setError(err.message || 'Error al crear el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim() || !user?.id) return;

    setSubmitting(true);
    setError(null);

    try {
      const replyData = {
        contenido: replyText.trim(),
        usuarioId: user.id,
        comentarioId: commentId,
      };

      const response = await commentService.responderComentario(replyData);
      
      // Agregar la respuesta inmediatamente al estado
      const newReply = {
        id: response.data.id,
        contenido: replyText.trim(),
        fecha_pub: new Date().toISOString(),
        comentarioId: commentId,
        usuario: {
          nombre: user.nombre,
          profilePicture: user.profilePicture
        }
      };

      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            respuestas: [...(comment.respuestas || []), newReply]
          };
        }
        return comment;
      }));
      
      setReplyText('');
      setReplyingTo(null);
    } catch (err) {
      setError(err.message || 'Error al responder el comentario');
    } finally {
      setSubmitting(false);
    }
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
                disabled={submitting}
              />
              {error && (
                <p className="text-red-400 text-xs mt-1">{error}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500">
                  {newComment.length} caracteres
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Enviando...' : 'Comentar'}
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
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-500 text-sm">Cargando comentarios...</p>
            </div>
          ) : comments.length === 0 ? (
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
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-xs overflow-hidden">
                    {comment.usuario?.profilePicture ? (
                      <img 
                        src={comment.usuario.profilePicture} 
                        alt={comment.usuario.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(comment.usuario?.nombre || 'Usuario')
                    )}
                  </div>
                </div>

                {/* Contenido del comentario */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {comment.usuario?.nombre || 'Usuario'}
                      </span>
                      {comment.usuarioId === user?.id && (
                        <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full">
                          Tú
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDate(comment.fecha_pub)}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm whitespace-pre-wrap break-words">
                    {comment.contenido}
                  </p>

                  {/* Botón de responder */}
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Reply className="w-3 h-3" />
                    Responder
                  </button>

                  {/* Input de respuesta */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all"
                        rows="2"
                        disabled={submitting}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReply(comment.id)}
                          disabled={!replyText.trim() || submitting}
                          className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Enviando...' : 'Responder'}
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all text-xs"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Respuestas existentes */}
                  {comment.respuestas && comment.respuestas.length > 0 && (
                    <div className="mt-3 space-y-2 pl-4 border-l-2 border-slate-700/50">
                      {comment.respuestas.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs overflow-hidden">
                              {reply.usuario?.profilePicture ? (
                                <img 
                                  src={reply.usuario.profilePicture} 
                                  alt={reply.usuario.nombre}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                getInitials(reply.usuario?.nombre || 'Usuario')
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-white">
                                {reply.usuario?.nombre || 'Usuario'}
                              </span>
                              <span className="text-xs text-slate-500">
                                {formatDate(reply.fecha_pub)}
                              </span>
                            </div>
                            <p className="text-slate-300 text-xs whitespace-pre-wrap break-words">
                              {reply.contenido}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
