-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol_usuarioId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rol_usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rol_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Curso" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo" INTEGER NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Registro" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inscripcion" (
    "id" SERIAL NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registroId" INTEGER NOT NULL,
    "opcioninscripcionId" INTEGER NOT NULL,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OpcionInscripcion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "OpcionInscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Calificacion" (
    "id" SERIAL NOT NULL,
    "nota" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "evaluacionId" INTEGER NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Topico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Recursos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,
    "topicoId" INTEGER NOT NULL,
    "tipotopicoId" INTEGER NOT NULL,

    CONSTRAINT "Recursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tipotopico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Tipotopico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evaluacion" (
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
CREATE TABLE "public"."CampoPreguntaEvaluacion" (
    "id" SERIAL NOT NULL,
    "evaluacionId" INTEGER NOT NULL,
    "respuestaEvaluacionId" INTEGER NOT NULL,
    "preguntaEvaluacionId" INTEGER NOT NULL,

    CONSTRAINT "CampoPreguntaEvaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RespuestaEvaluacion" (
    "id" SERIAL NOT NULL,
    "repuestas" TEXT,

    CONSTRAINT "RespuestaEvaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PreguntaEvaluacion" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,

    CONSTRAINT "PreguntaEvaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Diagnostico" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_ini" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CampoPreguntaDiagnostico" (
    "id" SERIAL NOT NULL,
    "diagnosticoId" INTEGER NOT NULL,
    "preguntaDiagnosticoId" INTEGER NOT NULL,

    CONSTRAINT "CampoPreguntaDiagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RespuestaDiagnostico" (
    "id" SERIAL NOT NULL,
    "respuesta" TEXT NOT NULL,

    CONSTRAINT "RespuestaDiagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PreguntaDiagnostico" (
    "id" SERIAL NOT NULL,
    "pregunata" TEXT NOT NULL,

    CONSTRAINT "PreguntaDiagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SeleccionRespuesta" (
    "id" SERIAL NOT NULL,
    "respuestaDiagnosticoId" INTEGER NOT NULL,
    "preguntaDiagnosticoId" INTEGER NOT NULL,

    CONSTRAINT "SeleccionRespuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Laboratorio" (
    "id" SERIAL NOT NULL,
    "topicoId" INTEGER NOT NULL,

    CONSTRAINT "Laboratorio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_usuario_nombre_key" ON "public"."Rol_usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_codigo_key" ON "public"."Curso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Tipotopico_nombre_key" ON "public"."Tipotopico"("nombre");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_rol_usuarioId_fkey" FOREIGN KEY ("rol_usuarioId") REFERENCES "public"."Rol_usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registro" ADD CONSTRAINT "Registro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registro" ADD CONSTRAINT "Registro_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripcion" ADD CONSTRAINT "Inscripcion_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "public"."Registro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripcion" ADD CONSTRAINT "Inscripcion_opcioninscripcionId_fkey" FOREIGN KEY ("opcioninscripcionId") REFERENCES "public"."OpcionInscripcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OpcionInscripcion" ADD CONSTRAINT "OpcionInscripcion_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "public"."Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Calificacion" ADD CONSTRAINT "Calificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Calificacion" ADD CONSTRAINT "Calificacion_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "public"."Evaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recursos" ADD CONSTRAINT "Recursos_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "public"."Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recursos" ADD CONSTRAINT "Recursos_tipotopicoId_fkey" FOREIGN KEY ("tipotopicoId") REFERENCES "public"."Tipotopico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evaluacion" ADD CONSTRAINT "Evaluacion_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "public"."Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampoPreguntaEvaluacion" ADD CONSTRAINT "CampoPreguntaEvaluacion_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "public"."Evaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampoPreguntaEvaluacion" ADD CONSTRAINT "CampoPreguntaEvaluacion_respuestaEvaluacionId_fkey" FOREIGN KEY ("respuestaEvaluacionId") REFERENCES "public"."RespuestaEvaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampoPreguntaEvaluacion" ADD CONSTRAINT "CampoPreguntaEvaluacion_preguntaEvaluacionId_fkey" FOREIGN KEY ("preguntaEvaluacionId") REFERENCES "public"."PreguntaEvaluacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnostico" ADD CONSTRAINT "Diagnostico_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "public"."Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampoPreguntaDiagnostico" ADD CONSTRAINT "CampoPreguntaDiagnostico_diagnosticoId_fkey" FOREIGN KEY ("diagnosticoId") REFERENCES "public"."Diagnostico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CampoPreguntaDiagnostico" ADD CONSTRAINT "CampoPreguntaDiagnostico_preguntaDiagnosticoId_fkey" FOREIGN KEY ("preguntaDiagnosticoId") REFERENCES "public"."PreguntaDiagnostico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeleccionRespuesta" ADD CONSTRAINT "SeleccionRespuesta_respuestaDiagnosticoId_fkey" FOREIGN KEY ("respuestaDiagnosticoId") REFERENCES "public"."RespuestaDiagnostico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeleccionRespuesta" ADD CONSTRAINT "SeleccionRespuesta_preguntaDiagnosticoId_fkey" FOREIGN KEY ("preguntaDiagnosticoId") REFERENCES "public"."PreguntaDiagnostico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Laboratorio" ADD CONSTRAINT "Laboratorio_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "public"."Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
