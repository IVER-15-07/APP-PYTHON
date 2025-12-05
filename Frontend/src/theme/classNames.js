/**
 * Constantes de clases reutilizables para layouts y contenedores
 * Usar estas constantes en lugar de repetir clases en cada componente
 */

// Layouts de página completa
export const PAGE_LAYOUTS = {
  // Fondo con gradiente estándar
  gradient: "min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary",
  // Fondo sólido
  solid: "min-h-screen bg-bg-primary",
  // Con padding estándar
  withPadding: "p-6 lg:p-10",
};

// Contenedores y cards
export const CONTAINERS = {
  // Card con efecto cristal
  glass: "bg-bg-glass backdrop-blur-xl rounded-card border border-border-secondary shadow-theme-lg",
  // Card sólida
  solid: "bg-bg-card rounded-card border border-border-secondary shadow-theme-md",
  // Card con hover
  hoverable: "bg-bg-card rounded-card border border-border-secondary shadow-theme-md hover:shadow-theme-lg hover:border-primary/50 transition-all duration-normal",
  // Sección principal
  section: "bg-bg-glass backdrop-blur-sm border border-border-secondary rounded-card p-6 shadow-theme-xl",
};

// Estados de carga y vacío
export const STATES = {
  // Spinner de carga
  spinner: "w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin",
  // Contenedor de loading
  loading: "flex items-center gap-3 p-4 bg-bg-card border border-border-secondary rounded-input",
  // Estado vacío
  empty: "p-12 text-center bg-bg-glass rounded-card border border-border-secondary",
};

// Inputs y formularios
export const FORM_ELEMENTS = {
  // Input estándar
  input: "w-full px-4 py-2.5 bg-bg-tertiary border border-border-primary rounded-input text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-border-accent focus:border-primary transition-all duration-slow",
  // Select estándar
  select: "px-4 py-2.5 bg-bg-tertiary border border-border-primary rounded-input text-text-primary focus:outline-none focus:ring-2 focus:ring-border-accent focus:border-primary transition-all duration-slow",
  // Label
  label: "block text-text-base text-text-primary mb-2",
};

// Iconos con colores del tema
export const ICON_COLORS = {
  primary: "text-primary",
  accent: "text-text-accent",
  success: "text-success",
  error: "text-error",
  warning: "text-warning",
  muted: "text-text-muted",
};

// Utilidades comunes
export const UTILS = {
  // Centrado
  centerFlex: "flex items-center justify-center",
  // Gap estándar
  gap: {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  },
  // Transiciones
  transition: "transition-all duration-normal",
};