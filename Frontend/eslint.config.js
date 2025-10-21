import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Ignorar carpetas de build
  { 
    ignores: ['dist', 'build', 'node_modules'] 
  },
  
  // Configuración principal para archivos JavaScript/JSX
  {
    files: ['**/*.{js,jsx}'],
    
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { 
          jsx: true 
        },
        sourceType: 'module',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    rules: {
      // Reglas recomendadas de JavaScript
      ...js.configs.recommended.rules,
      
      // Reglas recomendadas de React
      ...react.configs.recommended.rules,
      
      // Reglas recomendadas de React Hooks
      ...reactHooks.configs.recommended.rules,

      // Reglas personalizadas
      'react/react-in-jsx-scope': 'off', // No necesario en React 17+
      'react/prop-types': 'warn', // Advertencia para PropTypes faltantes
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Reglas opcionales que puedes ajustar
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
]