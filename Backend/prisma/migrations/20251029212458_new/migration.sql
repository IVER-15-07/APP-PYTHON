-- CreateTable
CREATE TABLE "RegistroPendiente" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contrasenaHash" TEXT NOT NULL,
    "rol_usuarioId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "expira" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroPendiente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "profilePicture" TEXT,
    "firebaseUid" TEXT,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "emailToken" TEXT,
    "emailTokenExpira" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rol_usuarioId" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudRol" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "rol_usuarioId" INTEGER NOT NULL,

    CONSTRAINT "solicitudRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol_usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" INTEGER,
    "esAprobado" BOOLEAN NOT NULL DEFAULT false,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "grupoId" INTEGER NOT NULL,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupo_Topico" (
    "id" SERIAL NOT NULL,
    "grupoId" INTEGER,
    "topicoId" INTEGER,
    "estadoId" INTEGER,

    CONSTRAINT "Grupo_Topico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nivel" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estado" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" SERIAL NOT NULL,
    "nota" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "topicoId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "tipo_topicoId" INTEGER NOT NULL,
    "nivelId" INTEGER NOT NULL,

    CONSTRAINT "Topico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipo_topico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Tipo_topico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recursos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "audiourl" TEXT,
    "subtitulo" TEXT,
    "imagenurl" TEXT,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "Recursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluacion" (
    "id" SERIAL NOT NULL,
    "evaluacion" TEXT NOT NULL,
    "descripcion" TEXT,
    "puntaje_evaluacion" INTEGER NOT NULL,
    "fecha_ini" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "topicoId" INTEGER NOT NULL,
    "tipo_evaluacionId" INTEGER NOT NULL,

    CONSTRAINT "Evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipo_evaluacion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Tipo_evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluacion_pregunta" (
    "id" SERIAL NOT NULL,
    "evaluacionId" INTEGER NOT NULL,
    "preguntaId" INTEGER NOT NULL,

    CONSTRAINT "Evaluacion_pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "parametroId" INTEGER NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Respuesta" (
    "id" SERIAL NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "respuesta" TEXT NOT NULL,
    "preguntaId" INTEGER NOT NULL,

    CONSTRAINT "Respuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parametro" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Parametro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistroPendiente_email_idx" ON "RegistroPendiente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_firebaseUid_key" ON "Usuario"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_emailToken_key" ON "Usuario"("emailToken");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudRol_usuarioId_key" ON "solicitudRol"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_usuario_nombre_key" ON "Rol_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_codigo_key" ON "Grupo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Registro_usuarioId_grupoId_key" ON "Registro"("usuarioId", "grupoId");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_nombre_key" ON "Curso"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Estado_nombre_key" ON "Estado"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_topico_nombre_key" ON "Tipo_topico"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_evaluacion_nombre_key" ON "Tipo_evaluacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Parametro_nombre_key" ON "Parametro"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_usuarioId_fkey" FOREIGN KEY ("rol_usuarioId") REFERENCES "Rol_usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudRol" ADD CONSTRAINT "solicitudRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudRol" ADD CONSTRAINT "solicitudRol_rol_usuarioId_fkey" FOREIGN KEY ("rol_usuarioId") REFERENCES "Rol_usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo_Topico" ADD CONSTRAINT "Grupo_Topico_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo_Topico" ADD CONSTRAINT "Grupo_Topico_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo_Topico" ADD CONSTRAINT "Grupo_Topico_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nivel" ADD CONSTRAINT "Nivel_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_tipo_topicoId_fkey" FOREIGN KEY ("tipo_topicoId") REFERENCES "Tipo_topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recursos" ADD CONSTRAINT "Recursos_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_tipo_evaluacionId_fkey" FOREIGN KEY ("tipo_evaluacionId") REFERENCES "Tipo_evaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion_pregunta" ADD CONSTRAINT "Evaluacion_pregunta_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "Evaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion_pregunta" ADD CONSTRAINT "Evaluacion_pregunta_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregunta" ADD CONSTRAINT "Pregunta_parametroId_fkey" FOREIGN KEY ("parametroId") REFERENCES "Parametro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
