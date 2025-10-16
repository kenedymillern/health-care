import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Disable or relax TypeScript rules
      "@typescript-eslint/no-explicit-any": "off", // Allow `any` and `Record<string, any>`
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Warn on unused vars, ignore those starting with _
      "prefer-const": "warn", // Warn instead of error for `let` vs `const`

      // Relax React/Next.js rules
      "react/no-unescaped-entities": "off", // Allow unescaped quotes in JSX
      "react-hooks/rules-of-hooks": "warn", // Warn on conditional hook calls
      "react-hooks/exhaustive-deps": "warn", // Warn on missing useEffect dependencies
      "@next/next/no-img-element": "off", // Allow <img> instead of <Image>
    },
  },
];

export default eslintConfig;
