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

    // Limpiar Object URLs cuando se desmonta
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
            if (videoPreview?.startsWith('blob:')) URL.revokeObjectURL(videoPreview);
            if (pdfPreview?.startsWith('blob:')) URL.revokeObjectURL(pdfPreview);
            if (selectedImagePreview?.startsWith('blob:')) URL.revokeObjectURL(selectedImagePreview);
        };
    }, [imagePreview, videoPreview, pdfPreview, selectedImagePreview]);

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

    const handleFileChange = async (file, contentType) => {
        if (!file) return;

        setSelectedFile(file);
        clearPreviews();

        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        try {
            // Texto (.txt, .md)
            if (contentType === '1' && 
                (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md'))) {
                const text = await readFileAsText(file);
                setTextPreview(text);
            }
            // Imágenes
            else if (fileType.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                setImagePreview(url);
            }
            // Word (.docx)
            else if (contentType === '1' && 
                (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 fileName.endsWith('.docx'))) {
                const html = await readDocxFile(file);
                setDocxPreview(html);
            }
            // Videos
            else if (contentType === '2' && fileType.startsWith('video/')) {
                const url = URL.createObjectURL(file);
                setVideoPreview(url);
            }
            // PDFs
            else if (fileName.endsWith('.pdf')) {
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
        clearPreviews,
    };
};
