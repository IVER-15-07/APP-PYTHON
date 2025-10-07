import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx}"],
    
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    
    settings: {
      react: {
        version: "detect",
      },
    },
    
    rules: {
      // Esta regla ahora sí se aplicará porque viene después
      "react/react-in-jsx-scope": "off",
      // Si usas React 17+, también puedes desactivar esta:
      "react/jsx-uses-react": "off",
    },
  },
]; 