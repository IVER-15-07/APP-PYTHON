import { FileText, FileImage, Play, Presentation, Upload, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FilePreview = ({ 
    selectedFile,
    selectedImage,
    textPreview,
    imagePreview,
    videoPreview,
    pdfPreview,
    docxPreview,
    selectedImagePreview,
    onBack,
    onSubmit,
    loading
}) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfError, setPdfError] = useState(null);

    // Resetear estados del PDF cuando cambie el archivo
    useEffect(() => {
        setNumPages(null);
        setPageNumber(1);
        setPdfError(null);
    }, [pdfPreview]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setPdfError(null);
    };

    const onDocumentLoadError = (error) => {
        // eslint-disable-next-line no-console
        console.error('Error al cargar PDF:', error);
        setPdfError(error.message || 'Error desconocido');
    };

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, numPages));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al formulario
                </button>
                <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Vista previa</span>
                </div>
            </div>

            {/* Preview Container */}
            <div className="border border-slate-700 rounded-xl bg-slate-900/50 overflow-hidden">
                {/* Header del archivo */}
                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            {textPreview && <FileText className="w-4 h-4 text-green-400" />}
                            {imagePreview && <FileImage className="w-4 h-4 text-blue-400" />}
                            {videoPreview && <Play className="w-4 h-4 text-purple-400" />}
                            {pdfPreview && <Presentation className="w-4 h-4 text-orange-400" />}
                            {selectedFile.name}
                        </h4>
                        <span className="text-xs text-slate-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                    </div>
                </div>
                
                {/* Contenido del preview */}
                <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                    
                    {/* Preview de TEXTO */}
                    {textPreview && (
                        <div className="bg-slate-950/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                                <span>{textPreview.length} caracteres</span>
                                <span>{textPreview.split('\n').length} líneas</span>
                            </div>
                            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
{textPreview.length > 5000 
    ? textPreview.slice(0, 5000) + '\n\n... (mostrando primeros 5000 caracteres)'
    : textPreview}
                            </pre>
                        </div>
                    )}

                    {/* Preview de WORD (.docx) */}
                    {docxPreview && (
                        <div className="bg-slate-950/50 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4 text-blue-400">
                                <FileText className="w-5 h-5" />
                                <span className="text-sm font-medium">Documento Word convertido</span>
                            </div>
                            <div 
                                className="prose prose-invert prose-sm max-w-none text-slate-300"
                                dangerouslySetInnerHTML={{ __html: docxPreview }}
                                style={{
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word'
                                }}
                            />
                        </div>
                    )}

                    {/* Preview de IMAGEN */}
                    {imagePreview && (
                        <div className="flex justify-center bg-slate-950/50 rounded-lg p-6">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-w-full max-h-[500px] rounded-lg shadow-lg object-contain"
                            />
                        </div>
                    )}

                    {/* Preview de IMAGEN ADICIONAL (para tópicos de texto) */}
                    {selectedImagePreview && (
                        <div className="bg-slate-950/50 rounded-lg p-4 mt-4">
                            <div className="flex items-center gap-2 mb-3 text-blue-400">
                                <FileImage className="w-5 h-5" />
                                <span className="text-sm font-medium">Imagen ilustrativa adicional</span>
                            </div>
                            <div className="flex justify-center p-4">
                                <img 
                                    src={selectedImagePreview} 
                                    alt="Imagen adicional" 
                                    className="max-w-full max-h-[400px] rounded-lg shadow-lg object-contain"
                                />
                            </div>
                            {selectedImage && (
                                <p className="text-xs text-slate-400 mt-2 text-center">
                                    {selectedImage.name} • {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            )}
                        </div>
                    )}

                    {/* Preview de VIDEO */}
                    {videoPreview && (
                        <div className="bg-slate-950/50 rounded-lg p-4">
                            <video 
                                src={videoPreview} 
                                controls 
                                className="w-full rounded-lg shadow-lg"
                                preload="metadata"
                            >
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                    )}

                    {/* Preview de PDF */}
                    {pdfPreview && (
                        <div className="bg-slate-950/50 rounded-lg p-4">
                            <Document
                                key={pdfPreview}
                                file={pdfPreview}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                loading={
                                    <div className="flex items-center justify-center py-12 text-slate-400">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-400"></div>
                                    </div>
                                }
                                error={
                                    <div className="text-red-400 text-sm text-center py-8">
                                        <p className="font-medium mb-2">Error al cargar el PDF</p>
                                        {pdfError && <p className="text-xs text-slate-400">{pdfError}</p>}
                                    </div>
                                }
                            >
                                <Page 
                                    pageNumber={pageNumber} 
                                    className="mx-auto"
                                    width={Math.min(700, typeof window !== 'undefined' ? window.innerWidth - 200 : 700)}
                                />
                            </Document>
                            
                            {/* Controles de navegación del PDF */}
                            {numPages && numPages > 1 && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                                    <button
                                        onClick={goToPrevPage}
                                        disabled={pageNumber <= 1}
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Anterior
                                    </button>
                                    
                                    <div className="text-sm text-slate-400">
                                        Página <span className="text-white font-medium">{pageNumber}</span> de <span className="text-white font-medium">{numPages}</span>
                                    </div>
                                    
                                    <button
                                        onClick={goToNextPage}
                                        disabled={pageNumber >= numPages}
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            
                            {numPages === 1 && (
                                <p className="text-xs text-slate-400 mt-3 text-center">
                                    Documento de 1 página
                                </p>
                            )}
                        </div>
                    )}

                    {/* Información para archivos NO PREVISALIZABLES */}
                    {!textPreview && !imagePreview && !videoPreview && !pdfPreview && !docxPreview && (
                        <div className="bg-slate-950/50 rounded-lg p-8 text-center">
                            <Upload className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 text-base mb-3">
                                Archivo seleccionado correctamente
                            </p>
                            <div className="text-sm text-slate-500 space-y-2">
                                <p>Tipo: {selectedFile.type || 'Desconocido'}</p>
                                <p>Nombre: {selectedFile.name}</p>
                            </div>
                            <p className="text-xs text-slate-600 mt-4">
                                Vista previa no disponible para este tipo de archivo
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Botón de enviar */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Creando...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Crear tópico
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

FilePreview.propTypes = {
    selectedFile: PropTypes.object.isRequired,
    selectedImage: PropTypes.object,
    textPreview: PropTypes.string,
    imagePreview: PropTypes.string,
    videoPreview: PropTypes.string,
    pdfPreview: PropTypes.string,
    docxPreview: PropTypes.string,
    selectedImagePreview: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default FilePreview;