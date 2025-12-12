import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MessageSquare, Send, Reply } from 'lucide-react';
import { authService } from '../../../../services/auth.api';
import { commentService } from '../../../../services/comments';
import {
  onNewComment,
  onNewReply,
  joinTopicRoom,
  leaveTopicRoom
} from '../../../../services/socketComment.service';

const TopicComments = ({ topicId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [user] = useState(authService.obtenerUsuarioActual());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Cargar comentarios al montar
  useEffect(() => {
    const fetchComments = async () => {
      if (!topicId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await commentService.getComentarios(topicId);
        const commentsData = response?.data || [];
        const sortedComments = commentsData.sort(
          (a, b) => new Date(b.fecha_pub) - new Date(a.fecha_pub)
        );
        setComments(sortedComments);
      } catch {
        setError('No se pudieron cargar los comentarios');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [topicId]);

  // WebSocket: unirse a la sala y escuchar eventos
  useEffect(() => {
    if (!user?.id) return;

    joinTopicRoom(topicId);

    // NUEVO COMENTARIO
    const unsubNewComment = onNewComment((data) => {
      const fixed = {
        ...data,
        usuario: data.usuario || {
          nombre: user.nombre,
          profilePicture: user.profilePicture,
        }
      };
      setComments(prev => [fixed, ...prev]);
    });

    // NUEVA RESPUESTA
    const unsubNewReply = onNewReply((data) => {
      const fixed = {
        ...data,
        usuario: data.usuario || {
          nombre: user.nombre,
          profilePicture: user.profilePicture,
        }
      };

      setComments(prev =>
        prev.map(c =>
          c.id === fixed.comentarioId
            ? { ...c, respuestas: [...(c.respuestas || []), fixed] }
            : c
        )
      );
    });

    return () => {
      leaveTopicRoom(topicId);
      unsubNewComment && unsubNewComment();
      unsubNewReply && unsubNewReply();
    };
  }, [topicId, user?.id, user?.nombre, user?.profilePicture]);

  // AGREGAR COMENTARIO (corregido)
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user?.id) return;

    setSubmitting(true);
    setError(null);

    try {
      await commentService.crearComentario({
        contenido: newComment.trim(),
        usuarioId: user.id,
        topicoId: Number(topicId),
      });

      // No agregamos nada al estado → lo hará el WebSocket
      setNewComment('');
    } catch (err) {
      setError(err.message || 'Error al crear el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  // AGREGAR RESPUESTA (corregido)
  const handleReply = async (commentId) => {
    if (!replyText.trim() || !user?.id) return;

    setSubmitting(true);
    setError(null);

    try {
      await commentService.responderComentario({
        contenido: replyText.trim(),
        usuarioId: user.id,
        comentarioId: commentId,
      });

      // NO agregamos manual → WebSocket lo hace
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
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Comentarios del profesor</h2>
        <span className="text-sm text-slate-500 ml-2">({comments.length})</span>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="flex items-start gap-3">
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

            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
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
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {comments.length > 0 && <div className="border-t border-slate-700/50" />}

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Cargando comentarios...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Aún no hay comentarios</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-xs">
                    {comment.usuario?.profilePicture ? (
                      <img
                        src={comment.usuario.profilePicture}
                        alt={comment.usuario.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(comment.usuario?.nombre || 'U')
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">
                      {comment.usuario?.nombre || 'Usuario'}
                    </span>
                    <span className="text-xs text-slate-500">{formatDate(comment.fecha_pub)}</span>
                  </div>

                  <p className="text-slate-300 text-sm">{comment.contenido}</p>

                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 mt-2 text-xs text-purple-400"
                  >
                    <Reply className="w-3 h-3" />
                    Responder
                  </button>

                  {replyingTo === comment.id && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white"
                        rows="2"
                        disabled={submitting}
                      />

                      <button
                        onClick={() => handleReply(comment.id)}
                        disabled={!replyText.trim() || submitting}
                        className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/30 text-xs font-medium"
                      >
                        {submitting ? 'Enviando...' : 'Responder'}
                      </button>
                    </div>
                  )}

                  {comment.respuestas?.length > 0 && (
                    <div className="mt-3 space-y-2 pl-4 border-l border-slate-700/50">
                      {comment.respuestas.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs">
                            {reply.usuario?.profilePicture ? (
                              <img
                                src={reply.usuario.profilePicture}
                                alt={reply.usuario.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              getInitials(reply.usuario?.nombre || 'U')
                            )}
                          </div>

                          <div>
                            <span className="text-xs font-semibold text-white">
                              {reply.usuario?.nombre}
                            </span>

                            <p className="text-slate-300 text-xs">{reply.contenido}</p>
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