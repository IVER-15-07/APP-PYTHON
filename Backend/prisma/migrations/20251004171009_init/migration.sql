-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "profilePicture" TEXT,
    "rol_usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol_usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" INTEGER NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" SERIAL NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registroId" INTEGER NOT NULL,
    "opcioninscripcionId" INTEGER NOT NULL,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpcionInscripcion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "OpcionInscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" SERIAL NOT NULL,
    "nota" INTEGER NOT NULL,
    "evaluacionId" INTEGER NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recursos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,
    "topicoId" INTEGER NOT NULL,
    "tipotopicoId" INTEGER NOT NULL,

    CONSTRAINT "Recursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipotopico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Tipotopico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluacion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puntaje_maximo" INTEGER NOT NULL,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "Evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampoPreguntaEvaluacion" (
    "id" SERIAL NOT NULL,
    "evaluacionId" INTEGER NOT NULL,
    "respuestaEvaluacionId" INTEGER NOT NULL,
    "preguntaEvaluacionId" INTEGER NOT NULL,

    CONSTRAINT "CampoPreguntaEvaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RespuestaEvaluacion" (
    "id" SERIAL NOT NULL,
    "repuestas" TEXT,

    CONSTRAINT "RespuestaEvaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreguntaEvaluacion" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,

    CONSTRAINT "PreguntaEvaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostico" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampoPreguntaDiagnostico" (
    "id" SERIAL NOT NULL,
    "diagnosticoId" INTEGER NOT NULL,
    "preguntaDiagnosticoId" INTEGER NOT NULL,

    CONSTRAINT "CampoPreguntaDiagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RespuestaDiagnostico" (
    "id" SERIAL NOT NULL,
    "respuesta" TEXT NOT NULL,

    CONSTRAINT "RespuestaDiagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreguntaDiagnostico" (
    "id" SERIAL NOT NULL,
    "pregunata" TEXT NOT NULL,

    CONSTRAINT "PreguntaDiagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeleccionRespuesta" (
    "id" SERIAL NOT NULL,
    "respuestaDiagnosticoId" INTEGER NOT NULL,
    "preguntaDiagnosticoId" INTEGER NOT NULL,

    CONSTRAINT "SeleccionRespuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laboratorio" (
    "id" SERIAL NOT NULL,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "Laboratorio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_usuario_nombre_key" ON "Rol_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_codigo_key" ON "Curso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Tipotopico_nombre_key" ON "Tipotopico"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_usuarioId_fkey" FOREIGN KEY ("rol_usuarioId") REFERENCES "Rol_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "Registro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_opcioninscripcionId_fkey" FOREIGN KEY ("opcioninscripcionId") REFERENCES "OpcionInscripcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpcionInscripcion" ADD CONSTRAINT "OpcionInscripcion_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "Evaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recursos" ADD CONSTRAINT "Recursos_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recursos" ADD CONSTRAINT "Recursos_tipotopicoId_fkey" FOREIGN KEY ("tipotopicoId") REFERENCES "Tipotopico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampoPreguntaEvaluacion" ADD CONSTRAINT "CampoPreguntaEvaluacion_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "Evaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampoPreguntaEvaluacion" ADD CONSTRAINT "CampoPreguntaEvaluacion_respuestaEvaluacionId_fkey" FOREIGN KEY ("respuestaEvaluacionId") REFERENCES "RespuestaEvaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampoPreguntaEvaluacion" ADD CONSTRAINT "CampoPreguntaEvaluacion_preguntaEvaluacionId_fkey" FOREIGN KEY ("preguntaEvaluacionId") REFERENCES "PreguntaEvaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampoPreguntaDiagnostico" ADD CONSTRAINT "CampoPreguntaDiagnostico_diagnosticoId_fkey" FOREIGN KEY ("diagnosticoId") REFERENCES "Diagnostico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampoPreguntaDiagnostico" ADD CONSTRAINT "CampoPreguntaDiagnostico_preguntaDiagnosticoId_fkey" FOREIGN KEY ("preguntaDiagnosticoId") REFERENCES "PreguntaDiagnostico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeleccionRespuesta" ADD CONSTRAINT "SeleccionRespuesta_respuestaDiagnosticoId_fkey" FOREIGN KEY ("respuestaDiagnosticoId") REFERENCES "RespuestaDiagnostico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeleccionRespuesta" ADD CONSTRAINT "SeleccionRespuesta_preguntaDiagnosticoId_fkey" FOREIGN KEY ("preguntaDiagnosticoId") REFERENCES "PreguntaDiagnostico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laboratorio" ADD CONSTRAINT "Laboratorio_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
