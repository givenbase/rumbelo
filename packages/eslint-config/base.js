import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import { hygieneConfig } from "./hygiene.js";

/** Shared TS + style rules (Meltizo library / Galighticus library baseline). */
export const sharedRules = {
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/ban-ts-comment": "off",
  "@typescript-eslint/consistent-type-imports": [
    "warn",
    {
      prefer: "type-imports",
      disallowTypeAnnotations: false,
      fixStyle: "inline-type-imports",
    },
  ],
  "prefer-const": "error",
  "no-var": "error",
  "no-debugger": "error",
  /** Ban single-letter identifiers (`g`, `d`, `j`) — use `goal`, `debt`, `jar`. */
  "id-length": [
    "error",
    {
      min: 2,
      exceptions: ["_"],
      properties: "never",
    },
  ],
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "turbo/no-undeclared-env-vars": "warn",
};

/**
 * Flat ESLint base — all Rumbelo packages extend this.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  hygieneConfig,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: sharedRules,
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/next-env.d.ts",
    ],
  },
];
