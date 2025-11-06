export const validateGrupoData = (grupoData) => {
    const errors = [];
    const currentDate = new Date();
    const startDate = new Date(grupoData.fechaInicio);
    const endDate = new Date(grupoData.fechaFin);
    const oneYearFromStart = new Date(startDate);
    oneYearFromStart.setFullYear(oneYearFromStart.getFullYear() + 1);

    // Validar título
    if (!grupoData.titulo || grupoData.titulo.length < 5) {
        errors.push('El título debe tener al menos 5 caracteres');
    }

    // Validar descripción
    if (!grupoData.descripcion || grupoData.descripcion.length < 15) {
        errors.push('La descripción debe tener al menos 15 caracteres');
    }

    // Validar fecha de inicio
    if (startDate < currentDate) {
        errors.push('La fecha de inicio no puede ser anterior a la fecha actual');
    }

    // Validar fecha de fin
    if (endDate < startDate) {
        errors.push('La fecha de fin no puede ser anterior a la fecha de inicio');
    }

    // Validar duración máxima
    if (endDate > oneYearFromStart) {
        errors.push('La duración del curso no puede superar 1 año');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Función auxiliar para validar el formato de fecha
export const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};