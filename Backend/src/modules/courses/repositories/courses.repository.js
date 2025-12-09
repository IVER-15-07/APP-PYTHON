import prisma from "../../../config/database.js";

export const coursesRepository = {

    getMyCourses: async () => prisma.curso.findMany(
        {
            select: {
                id: true,
                nombre: true,
                descripcion: true,
                nivel: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
        }
    ),

    getCoursesWithStudentCount: async () => prisma.curso.findMany({
        select: {
            id: true,
            nombre: true,
            descripcion: true,
            nivel: {
                select: {
                    id: true,
                    nombre: true,
                },
            },
            grupo: {
                select: {
                    id: true,
                    titulo: true,
                    registro: {
                        select: {
                            usuarioId: true,
                            usuario: {
                                select: {
                                    rol_usuarioId: true,
                                    rol_usuario: {
                                        select: {
                                            nombre: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
    }),

    getCourseWithStudentCount: async (cursoId) => prisma.curso.findUnique({
        where: { id: cursoId },
        select: {
            id: true,
            nombre: true,
            descripcion: true,
            grupo: {
                select: {
                    id: true,
                    titulo: true,
                    registro: {
                        select: {
                            usuarioId: true,
                            usuario: {
                                select: {
                                    rol_usuarioId: true,
                                    rol_usuario: {
                                        select: {
                                            nombre: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
    }),

    getListStudentsBygroupId: async (grupoId) => prisma.registro.findMany({
        where: { grupoId: grupoId },
        select: {
            id: true,
            fecha_registro: true,
            usuario: {
                select: {
                    id: true,   
                    nombre: true,
                    email: true,
                    profilePicture: true,
                    rol_usuario: {
                        select: {
                            id: true,
                            nombre: true    
                        }
                    }
                }
            }
        }
    }),



}
