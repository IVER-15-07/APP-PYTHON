-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "profilePicture" TEXT,
    "firebaseUid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rol_usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
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
    "codigo" INTEGER NOT NULL,

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
    "nombreNivel" TEXT NOT NULL,
    "grupoId" INTEGER,
    "topicoId" INTEGER,

    CONSTRAINT "Grupo_Topico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" SERIAL NOT NULL,
    "nota" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "tipo_topicoId" INTEGER NOT NULL,

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
    "descripcion" TEXT,
    "topicoId" INTEGER NOT NULL,
    "tipo_recursoId" INTEGER NOT NULL,

    CONSTRAINT "Recursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipo_recurso" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Tipo_recurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluacion" (
    "id" SERIAL NOT NULL,
    "evaluacion" TEXT NOT NULL,
    "descripcion" TEXT,
    "puntaje_evaluacion" INTEGER NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "Evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipo_evaluacion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "evaluacionId" INTEGER NOT NULL,

    CONSTRAINT "Tipo_evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluacion_pregunta" (
    "id" SERIAL NOT NULL,
    "evaluacionId" INTEGER NOT NULL,
    "preguntaId" INTEGER NOT NULL,
    "parametroId" INTEGER NOT NULL,

    CONSTRAINT "Evaluacion_pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,

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
    "Parametro" TEXT NOT NULL,

    CONSTRAINT "Parametro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_firebaseUid_key" ON "Usuario"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_usuario_nombre_key" ON "Rol_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_codigo_key" ON "Grupo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_topico_nombre_key" ON "Tipo_topico"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_recurso_nombre_key" ON "Tipo_recurso"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_evaluacion_nombre_key" ON "Tipo_evaluacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Parametro_Parametro_key" ON "Parametro"("Parametro");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_usuarioId_fkey" FOREIGN KEY ("rol_usuarioId") REFERENCES "Rol_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo_Topico" ADD CONSTRAINT "Grupo_Topico_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo_Topico" ADD CONSTRAINT "Grupo_Topico_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_tipo_topicoId_fkey" FOREIGN KEY ("tipo_topicoId") REFERENCES "Tipo_topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recursos" ADD CONSTRAINT "Recursos_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recursos" ADD CONSTRAINT "Recursos_tipo_recursoId_fkey" FOREIGN KEY ("tipo_recursoId") REFERENCES "Tipo_recurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tipo_evaluacion" ADD CONSTRAINT "Tipo_evaluacion_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "Evaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion_pregunta" ADD CONSTRAINT "Evaluacion_pregunta_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "Evaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion_pregunta" ADD CONSTRAINT "Evaluacion_pregunta_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion_pregunta" ADD CONSTRAINT "Evaluacion_pregunta_parametroId_fkey" FOREIGN KEY ("parametroId") REFERENCES "Parametro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
