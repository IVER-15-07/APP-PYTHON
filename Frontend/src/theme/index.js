// Colores principales del proyecto
const colors = {
  // Colores principales
  primary: "#10b981", // emerald-500
  primaryDark: "#059669", // emerald-600
  primaryLight: "#34d399", // emerald-400
  
  // Verde/Cian para gradientes
  secondary: "#06d6a0", // green-400
  accent: "#22d3ee", // cyan-400
  
  // Colores de fondo
  backgroundPrimary: "#0f172a", // slate-950
  backgroundSecondary: "#1e293b", // slate-800
  backgroundTertiary: "#334155", // slate-700
  backgroundCard: "#1e293b80", // slate-900/80
  backgroundCardHover: "#475569", // slate-600
  
  // Colores de texto
  textPrimary: "#ffffff", // white
  textSecondary: "#94a3b8", // slate-400
  textMuted: "#64748b", // slate-500
  textAccent: "#10b981", // emerald-500
  
  // Estados
  error: "#ef4444", // red-500
  errorBg: "#ef444410", // red-500/10
  errorBorder: "#ef444430", // red-500/30
  success: "#10b981", // emerald-500
  warning: "#f59e0b", // amber-500
  
  // Bordes
  borderPrimary: "#475569", // slate-600
  borderSecondary: "#37415180", // slate-700/50
  borderAccent: "#10b98130", // emerald-500/30
  
  // Neutros
  neutral1: "#f1f5f9", // slate-100
  neutral2: "#e2e8f0", // slate-200
  neutral3: "#cbd5e1", // slate-300
  
  // Transparencias
  glass: "#1e293b80", // bg-slate-900/80 para efectos de cristal
  overlay: "#0f172a99", // overlay oscuro
};

// Formas/Bordes
const shapes = {
  // Radios de borde
  cardRadius: "16px", // rounded-2xl
  inputRadius: "12px", // rounded-xl  
  buttonRadius: "12px", // rounded-xl
  chipRadius: "9999px", // rounded-full
  modalRadius: "16px", // rounded-2xl
  
  // Tamaños específicos
  avatarSmall: "32px",
  avatarMedium: "48px", 
  avatarLarge: "64px",
};

// Tipografía
const typography = {
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  
  // Títulos display
  display: {
    // Para títulos principales como "PyLearn"
    xl: {
      fontSize: "48px",
      fontWeight: 700,
      lineHeight: "56px",
      letterSpacing: "-0.02em",
    },
    large: {
      fontSize: "36px", 
      fontWeight: 700,
      lineHeight: "44px",
      letterSpacing: "-0.02em",
    },
    medium: {
      fontSize: "28px",
      fontWeight: 600, 
      lineHeight: "36px",
      letterSpacing: "-0.01em",
    },
    small: {
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: "32px", 
    },
  },
  
  // Texto regular
  text: {
    large: { 
      fontSize: "18px", 
      fontWeight: 400, 
      lineHeight: "28px" 
    },
    medium: { 
      fontSize: "16px", 
      fontWeight: 400, 
      lineHeight: "24px" 
    },
    small: { 
      fontSize: "14px", 
      fontWeight: 400, 
      lineHeight: "20px" 
    },
    tiny: { 
      fontSize: "12px", 
      fontWeight: 400, 
      lineHeight: "18px" 
    },
  },
  
  // Para inputs
  input: {
    large: { 
      fontSize: "16px", 
      fontWeight: 400, 
      lineHeight: "24px" 
    },
    medium: { 
      fontSize: "14px", 
      fontWeight: 400, 
      lineHeight: "20px" 
    },
  },
  
  // Para botones
  button: {
    large: { 
      fontSize: "16px", 
      fontWeight: 600, 
      lineHeight: "24px" 
    },
    medium: { 
      fontSize: "14px", 
      fontWeight: 600, 
      lineHeight: "20px" 
    },
    small: { 
      fontSize: "12px", 
      fontWeight: 600, 
      lineHeight: "18px" 
    },
  },
  
  // Para códigos o monospace
  code: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
  },
};

// Espaciados estandarizados
const spacing = {
  // Spacing interno de componentes
  xs: "8px",
  sm: "12px", 
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
  
  // Para contenedores
  containerPadding: "20px",
  sectionSpacing: "64px",
};

// Sombras
const shadows = {
  small: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  medium: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  large: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  
  // Sombras específicas del proyecto
  emerald: "0 10px 15px -3px rgb(16 185 129 / 0.25)", // shadow-emerald-500/25
  button: "0 4px 14px 0 rgb(16 185 129 / 0.25)",
};

// Transiciones
const transitions = {
  fast: "150ms ease-in-out",
  normal: "200ms ease-in-out", 
  slow: "300ms ease-in-out",
  
  // Transiciones específicas
  button: "all 200ms ease-in-out",
  input: "all 300ms ease-in-out",
  modal: "all 200ms ease-in-out",
};

export const theme = { 
  colors, 
  shapes, 
  typography, 
  spacing, 
  shadows, 
  transitions 
};

// Re-export class name constants
export * from './classNames.js';

// Configuración para Tailwind CSS
export const getTailwindConfig = (themeObj) => ({
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Colores principales
        primary: {
          DEFAULT: themeObj.colors.primary,
          dark: themeObj.colors.primaryDark,
          light: themeObj.colors.primaryLight,
        },
        secondary: themeObj.colors.secondary,
        accent: themeObj.colors.accent,
        
        // Backgrounds
        'bg-primary': themeObj.colors.backgroundPrimary,
        'bg-secondary': themeObj.colors.backgroundSecondary,
        'bg-tertiary': themeObj.colors.backgroundTertiary,
        'bg-card': themeObj.colors.backgroundCard,
        'bg-card-hover': themeObj.colors.backgroundCardHover,
        'bg-glass': themeObj.colors.glass,
        'bg-overlay': themeObj.colors.overlay,
        
        // Text colors
        'text-primary': themeObj.colors.textPrimary,
        'text-secondary': themeObj.colors.textSecondary,
        'text-muted': themeObj.colors.textMuted,
        'text-accent': themeObj.colors.textAccent,
        
        // Estados
        error: {
          DEFAULT: themeObj.colors.error,
          bg: themeObj.colors.errorBg,
          border: themeObj.colors.errorBorder,
        },
        success: themeObj.colors.success,
        warning: themeObj.colors.warning,
        
        // Bordes  
        'border-primary': themeObj.colors.borderPrimary,
        'border-secondary': themeObj.colors.borderSecondary,
        'border-accent': themeObj.colors.borderAccent,
        
        // Neutros
        neutral: {
          1: themeObj.colors.neutral1,
          2: themeObj.colors.neutral2,
          3: themeObj.colors.neutral3,
        },
      },
      
      borderRadius: {
        'card': themeObj.shapes.cardRadius,
        'input': themeObj.shapes.inputRadius,
        'button': themeObj.shapes.buttonRadius,
        'chip': themeObj.shapes.chipRadius,
        'modal': themeObj.shapes.modalRadius,
      },
      
      fontFamily: {
        sans: themeObj.typography.fontFamily,
        code: themeObj.typography.code.fontFamily,
      },
      
      fontSize: {
        // Display sizes
        'display-xl': [
          themeObj.typography.display.xl.fontSize,
          {
            lineHeight: themeObj.typography.display.xl.lineHeight,
            fontWeight: themeObj.typography.display.xl.fontWeight,
            letterSpacing: themeObj.typography.display.xl.letterSpacing,
          },
        ],
        'display-lg': [
          themeObj.typography.display.large.fontSize,
          {
            lineHeight: themeObj.typography.display.large.lineHeight,
            fontWeight: themeObj.typography.display.large.fontWeight,
            letterSpacing: themeObj.typography.display.large.letterSpacing,
          },
        ],
        'display-md': [
          themeObj.typography.display.medium.fontSize,
          {
            lineHeight: themeObj.typography.display.medium.lineHeight,
            fontWeight: themeObj.typography.display.medium.fontWeight,
            letterSpacing: themeObj.typography.display.medium.letterSpacing,
          },
        ],
        'display-sm': [
          themeObj.typography.display.small.fontSize,
          {
            lineHeight: themeObj.typography.display.small.lineHeight,
            fontWeight: themeObj.typography.display.small.fontWeight,
          },
        ],
        
        // Text sizes
        'text-lg': [
          themeObj.typography.text.large.fontSize,
          {
            lineHeight: themeObj.typography.text.large.lineHeight,
            fontWeight: themeObj.typography.text.large.fontWeight,
          },
        ],
        'text-base': [
          themeObj.typography.text.medium.fontSize,
          {
            lineHeight: themeObj.typography.text.medium.lineHeight,
            fontWeight: themeObj.typography.text.medium.fontWeight,
          },
        ],
        'text-sm': [
          themeObj.typography.text.small.fontSize,
          {
            lineHeight: themeObj.typography.text.small.lineHeight,
            fontWeight: themeObj.typography.text.small.fontWeight,
          },
        ],
        'text-xs': [
          themeObj.typography.text.tiny.fontSize,
          {
            lineHeight: themeObj.typography.text.tiny.lineHeight,
            fontWeight: themeObj.typography.text.tiny.fontWeight,
          },
        ],
        
        // Button sizes
        'btn-lg': [
          themeObj.typography.button.large.fontSize,
          {
            lineHeight: themeObj.typography.button.large.lineHeight,
            fontWeight: themeObj.typography.button.large.fontWeight,
          },
        ],
        'btn-base': [
          themeObj.typography.button.medium.fontSize,
          {
            lineHeight: themeObj.typography.button.medium.lineHeight,
            fontWeight: themeObj.typography.button.medium.fontWeight,
          },
        ],
        'btn-sm': [
          themeObj.typography.button.small.fontSize,
          {
            lineHeight: themeObj.typography.button.small.lineHeight,
            fontWeight: themeObj.typography.button.small.fontWeight,
          },
        ],
      },
      
      boxShadow: {
        'theme-sm': themeObj.shadows.small,
        'theme-md': themeObj.shadows.medium,
        'theme-lg': themeObj.shadows.large,
        'theme-xl': themeObj.shadows.xl,
        'theme-emerald': themeObj.shadows.emerald,
        'theme-button': themeObj.shadows.button,
      },
      
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms', 
        'slow': '300ms',
      },
      
      spacing: {
        'theme-xs': themeObj.spacing.xs,
        'theme-sm': themeObj.spacing.sm,
        'theme-md': themeObj.spacing.md,
        'theme-lg': themeObj.spacing.lg,
        'theme-xl': themeObj.spacing.xl,
        'theme-xxl': themeObj.spacing.xxl,
      },
    },
  },
  plugins: [],
});

export default theme;

/* 
=== EJEMPLOS DE USO ===

// Colores primarios y backgrounds
<div className="bg-bg-primary text-text-primary p-4 rounded-card">Fondo principal</div>
<div className="bg-bg-card text-text-primary rounded-card">Card con fondo</div>
<button className="bg-primary hover:bg-primary-dark text-white">Botón primario</button>
<div className="bg-error-bg border border-error-border text-error rounded-input p-3">Error message</div>

// Tipografías
<h1 className="text-display-xl bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
  PyLearn - Título Principal
</h1>

<h2 className="text-display-lg text-text-primary">
  Subtítulo Grande
</h2>

<h3 className="text-display-md text-text-accent">
  Título Mediano
</h3>

<p className="text-text-base text-text-secondary">
  Texto normal del párrafo
</p>

<small className="text-text-sm text-text-muted">
  Texto pequeño
</small>

// Inputs y formularios
<input
  className="w-full px-4 py-4 bg-bg-tertiary border border-border-primary rounded-input 
             text-text-primary placeholder-text-secondary focus:outline-none 
             focus:border-primary focus:ring-2 focus:ring-border-accent transition-all duration-slow 
             disabled:opacity-60"
  placeholder="Correo electrónico"
/>

<select className="px-3 py-2 border border-border-primary rounded-input text-text-base 
                   text-text-primary bg-bg-card focus:outline-none focus:border-primary">
  <option>Opción 1</option>
  <option>Opción 2</option>
</select>

// Botones
<button className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark 
                   hover:from-primary-dark hover:to-primary text-white 
                   font-semibold rounded-button transition-all duration-normal 
                   transform hover:scale-[1.02] active:scale-[0.98] 
                   shadow-theme-button border border-border-accent">
  Botón Principal
</button>

<button className="px-4 py-2 bg-bg-secondary hover:bg-bg-card-hover 
                   text-text-secondary border border-border-secondary 
                   hover:border-border-primary rounded-button transition-all duration-normal">
  Botón Secundario
</button>

// Cards y contenedores
<div className="bg-bg-glass backdrop-blur-xl rounded-card p-6 shadow-theme-lg 
                border border-border-secondary">
  <h3 className="text-display-sm text-text-primary mb-2">Título de Card</h3>
  <p className="text-text-base text-text-secondary">Descripción del contenido</p>
</div>

// Efectos de cristal y overlays
<div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
  <div className="bg-bg-glass backdrop-blur-xl rounded-modal border border-border-secondary">
    Contenido con efecto cristal
  </div>
</div>

// Estados y notificaciones  
<div className="bg-success/10 border border-success/30 text-success rounded-input p-4">
  Mensaje de éxito
</div>

<div className="bg-warning/10 border border-warning/30 text-warning rounded-input p-4">
  Mensaje de advertencia
</div>
*/