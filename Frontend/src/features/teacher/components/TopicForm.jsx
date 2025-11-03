import { Plus, Upload, Ban, AlertCircle, FileText, Video, Presentation, X } from 'lucide-react';
import PropTypes from 'prop-types';
import CustomDropdown from './CustomDropdown';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';

const TopicForm = ({ form, onChange, onSubmit, onFileChange, loading, error, cancel, selectedFile, topicTypes = [], levels = [], isModal = false, onClose }) => {
    const formContent = (
        <>
            <div className="flex items-center gap-2 mb-6">
                <Plus className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">Crear nuevo tópico</h2>
            </div>


            {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Título del tópico *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        placeholder="Ej: Introducción a Python"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                        disabled={loading}
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <CustomDropdown
                        label="Tipo de contenido"
                        name="contentType"
                        value={form.contentType}
                        onChange={onChange}
                        placeholder="Selecciona tipo de contenido"
                        required
                        disabled={loading}
                        options={topicTypes.map(type => ({
                            value: type.id.toString(),
                            label: type.nombre.charAt(0).toUpperCase() + type.nombre.slice(1),
                            }))}
                    />

                    <CustomDropdown
                        label="Nivel"
                        name="level"
                        value={form.level}
                        onChange={onChange}
                        placeholder="Selecciona un nivel"
                        required
                        disabled={loading}
                        options={levels.map(level => ({
                            value: level.id.toString(),
                            label: level.nombre,
                        }))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Descripción</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        placeholder="Describe de qué trata el tópico..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all resize-none"
                        disabled={loading}
                    />
                </div>

                {/* Sección de carga de archivos - Aparece solo si hay un tipo de contenido seleccionado */}
                {form.contentType && (
                    <div className="border-t border-slate-700/50 pt-5">
                        <div className="flex items-center gap-2 mb-4">
                            {form.contentType === '1' && <FileText className="w-5 h-5 text-green-400" />}
                            {form.contentType === '2' && <Video className="w-5 h-5 text-green-400" />}
                            {form.contentType === '3' && <Presentation className="w-5 h-5 text-green-400" />}
                            <h3 className="text-lg font-semibold text-white">
                                Subir {form.contentType === '1' ? 'archivo de texto' : form.contentType === '2' ? 'video' : 'presentación'}
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/* Input de archivo */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Archivo *
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        name="file"
                                        onChange={onFileChange}
                                        accept={
                                            form.contentType === '1'
                                                ? '.txt,.md,.doc,.docx'
                                                : form.contentType === '2'
                                                    ? '.mp4,.avi,.mov,.mkv,.webm'
                                                    : '.ppt,.pptx,.pdf,.key'
                                        }
                                        required
                                        disabled={loading}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className={`flex items-center justify-center gap-3 w-full px-4 py-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${selectedFile
                                            ? 'border-green-500/50 bg-green-500/5'
                                            : 'border-slate-700/50 bg-slate-800/50 hover:border-green-500/30 hover:bg-slate-800'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Upload className={`w-6 h-6 ${selectedFile ? 'text-green-400' : 'text-slate-400'}`} />
                                        <div className="text-center">
                                            {selectedFile ? (
                                                <>
                                                    <p className="text-green-400 font-medium">{selectedFile.name}</p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-slate-300 font-medium">
                                                        Haz clic para seleccionar un archivo
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {form.contentType === '1' && 'TXT, MD, DOC, DOCX'}
                                                        {form.contentType === '2' && 'MP4, AVI, MOV, MKV, WEBM'}
                                                        {form.contentType === '3' && 'PPT, PPTX, PDF, KEY'}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Información adicional según el tipo */}
                            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
                                <p className="text-sm text-slate-400">
                                    {form.contentType === '1' && 'Puedes subir archivos de texto plano, Markdown o documentos de Word.'}
                                    {form.contentType === '2' && 'Asegúrate de que el video esté en un formato compatible y no sea muy pesado.'}
                                    {form.contentType === '3' && 'Puedes subir presentaciones de PowerPoint o archivos PDF.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading || !form.contentType || (form.contentType && !selectedFile)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 border border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Upload className="w-4 h-4" />
                        {loading ? 'Subiendo...' : 'Crear tópico'}
                    </button>

                    <button
                        type="button"
                        onClick={isModal ? onClose : cancel}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-xl border border-slate-600/50 transition-all duration-200 font-medium"
                    >
                        <Ban className="w-4 h-4" />
                        Cancelar
                    </button>
                </div>
            </form>
        </>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header del modal */}
                    <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Crear nuevo tópico</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Contenido del modal */}
                    <div className="p-6">
                        {formContent}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="lg:col-span-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            {formContent}
        </section>
    );
};

export default TopicForm;

TopicForm.propTypes = {
    form: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        contentType: PropTypes.string,
        level: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onFileChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    cancel: PropTypes.func.isRequired,
    selectedFile: PropTypes.object,
    topicTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string,
    })),
    levels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string,
        cursoId: PropTypes.number,
    })),
    isModal: PropTypes.bool,
    onClose: PropTypes.func,
};
