import { useState, useEffect } from 'react';
import mammoth from 'mammoth';

export const useFilePreview = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [textPreview, setTextPreview] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [videoPreview, setVideoPreview] = useState('');
    const [pdfPreview, setPdfPreview] = useState('');
    const [docxPreview, setDocxPreview] = useState('');
    const [selectedImagePreview, setSelectedImagePreview] = useState('');

    // Limpiar Object URLs - cada preview tiene su propio efecto
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        return () => {
            if (videoPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

    useEffect(() => {
        return () => {
            if (pdfPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(pdfPreview);
            }
        };
    }, [pdfPreview]);

    useEffect(() => {
        return () => {
            if (selectedImagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(selectedImagePreview);
            }
        };
    }, [selectedImagePreview]);

    const clearPreviews = () => {
        setTextPreview('');
        setImagePreview('');
        setVideoPreview('');
        setPdfPreview('');
        setDocxPreview('');
    };

    const clearAll = () => {
        setSelectedFile(null);
        setSelectedImage(null);
        clearPreviews();
        setSelectedImagePreview('');
    };

    const loadExistingFile = (topic) => {
        if (!topic?.recursos || topic.recursos.length === 0) return;

        const recurso = topic.recursos[0];
        clearPreviews();

        // Cargar el archivo principal (url)
        if (recurso.url) {
            const url = recurso.url.toLowerCase();
            
            if (url.includes('.pdf')) {
                setPdfPreview(recurso.url);
            } else if (url.includes('.mp4') || url.includes('.webm')) {
                setVideoPreview(recurso.url);
            } else if (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg')) {
                setImagePreview(recurso.url);
            }
        }
        
        // Cargar recursos específicos (audiourl)
        if (recurso.audiourl) {
            setVideoPreview(recurso.audiourl);
        }

        // Cargar imagen secundaria (imagenurl) para tipo contenido 1
        if (recurso.imagenurl) {
            setSelectedImagePreview(recurso.imagenurl);
        }
    };

    const handleFileChange = async (file, contentType) => {
        if (!file) return;

        setSelectedFile(file);

        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        try {
            // Texto (.txt, .md)
            if (contentType === '1' && 
                (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md'))) {
                // Limpiar solo los otros formatos de tipo contenido 1
                setPdfPreview('');
                setDocxPreview('');
                setImagePreview('');
                setVideoPreview('');
                const text = await readFileAsText(file);
                setTextPreview(text);
            }
            // Imágenes (solo si NO es tipo contenido 1, porque en tipo 1 las imágenes son secundarias)
            else if (contentType !== '1' && fileType.startsWith('image/')) {
                // Limpiar solo los otros formatos
                setTextPreview('');
                setPdfPreview('');
                setDocxPreview('');
                setVideoPreview('');
                const url = URL.createObjectURL(file);
                setImagePreview(url);
            }
            // Word (.docx)
            else if (contentType === '1' && 
                (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 fileName.endsWith('.docx'))) {
                // Limpiar solo los otros formatos de tipo contenido 1
                setTextPreview('');
                setPdfPreview('');
                setImagePreview('');
                setVideoPreview('');
                const html = await readDocxFile(file);
                setDocxPreview(html);
            }
            // Videos
            else if (contentType === '2' && fileType.startsWith('video/')) {
                // Limpiar solo los otros formatos
                setTextPreview('');
                setImagePreview('');
                setPdfPreview('');
                setDocxPreview('');
                const url = URL.createObjectURL(file);
                setVideoPreview(url);
            }
            // PDFs
            else if (fileName.endsWith('.pdf')) {
                // Limpiar solo los otros formatos
                setTextPreview('');
                setImagePreview('');
                setVideoPreview('');
                setDocxPreview('');
                const url = URL.createObjectURL(file);
                setPdfPreview(url);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error al procesar archivo:', error);
        }
    };

    const handleImageChange = (file) => {
        if (!file) return;

        setSelectedImage(file);

        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setSelectedImagePreview(url);
        }
    };

    // Helpers
    const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Error al leer archivo de texto'));
            reader.readAsText(file);
        });
    };

    const readDocxFile = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    resolve(result.value);
                } catch {
                    reject(new Error('Error al leer archivo Word'));
                }
            };
            reader.onerror = () => reject(new Error('Error al leer archivo Word'));
            reader.readAsArrayBuffer(file);
        });
    };

    return {
        // Estados
        selectedFile,
        selectedImage,
        textPreview,
        imagePreview,
        videoPreview,
        pdfPreview,
        docxPreview,
        selectedImagePreview,
        // Funciones
        handleFileChange,
        handleImageChange,
        clearAll,
        loadExistingFile,
    };
};
