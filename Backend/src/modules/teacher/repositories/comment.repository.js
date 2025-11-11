import prisma from "../../../config/database.js";

export const commentRepository = {

        createComment: (data) => prisma.comment.create({
                data
        })
}