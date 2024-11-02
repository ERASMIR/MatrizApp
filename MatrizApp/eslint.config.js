import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,  // Agregar el entorno Node.js
        process: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
      },
    },
    plugins: {
      react: pluginReact,
    },
    // Aquí se incluyen directamente las configuraciones recomendadas
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["warn", { "varsIgnorePattern": "React" }],
      "no-undef": "off", // Desactivar la advertencia de variables no definidas
    },
  },
];
