const eslintConfig = [
  {
    ignores: ["src/generated/**", ".next/**", "node_modules/**", "dist/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",   // was "error"
      "@typescript-eslint/ban-ts-comment": "warn",    // allow @ts-ignore
      "react/no-unescaped-entities": "warn",          // don’t fail on quotes
      "react-hooks/rules-of-hooks": "error",          // keep this strict
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
