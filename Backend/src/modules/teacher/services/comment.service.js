import { commentRepository } from "../repositories/comment.repository";


export const commentService = {
    async createComment(usuarioId, commentData) {
        const { contenido } = commentData;  
        return commentRepository.createComment({    
            contenido,
            usuarioId,
        });
    }
}