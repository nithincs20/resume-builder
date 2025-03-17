import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // Base config
  pluginJs.configs.recommended,

  // Ignore paths (this is the correct way for ESLint Flat Config)
  {
    ignores: [
      "node_modules/",
      "backend/node_modules/",
      "uploads/",
      "docs/"
    ]
  },

  // Custom rule setup
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        window: "readonly",
        document: "readonly",
        console: "readonly"
      }
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-unused-vars": "warn",
      "no-console": "off",
      "eqeqeq": ["warn", "always"],
      "curly": "warn",
      // "indent": ["error", 10],
      "no-var": "warn",
      "prefer-const": "warn"
    }
  }
];
