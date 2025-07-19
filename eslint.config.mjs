import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // This is a new configuration object for global settings, including ignores.
  {
    // Add the ignore property here
    ignore: ['src/generated/'], // <-- ADD THIS LINE
  },
  // Your existing Next.js configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // You might also want to add your custom rules here if you have any,
  // or add another object for specific rule overrides.
  // Example for adding some common TypeScript rules if not already covered:
  // {
  //   files: ["**/*.ts", "**/*.tsx"],
  //   rules: {
  //     "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  //     "@typescript-eslint/explicit-module-boundary-types": "off",
  //     // You can keep these off if you are not using 'this' aliasing or 'require' in your own code
  //     // If the errors are only from generated code, the 'ignore' will handle it.
  //     // "@typescript-eslint/no-this-alias": "off",
  //     // "@typescript-eslint/no-unused-expressions": "off",
  //     // "@typescript-eslint/no-require-imports": "off",
  //   }
  // }
];

export default eslintConfig;