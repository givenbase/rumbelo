import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginTailwindcss from "eslint-plugin-tailwindcss";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

import { config as baseConfig, sharedRules } from "./base.js";

const configDir = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(configDir, "../..");
const tailwindCssConfigPath = resolve(
  monorepoRoot,
  "packages/config/tailwind/globals.css",
);

/** Galighticus-style a11y subset — warn, not error. */
const jsxA11yWarnRules = {
  "jsx-a11y/alt-text": "warn",
  "jsx-a11y/aria-props": "warn",
  "jsx-a11y/aria-proptypes": "warn",
  "jsx-a11y/aria-unsupported-elements": "warn",
  "jsx-a11y/role-has-required-aria-props": "warn",
  "jsx-a11y/role-supports-aria-props": "warn",
};

/**
 * Next.js apps (Meltizo next.js baseline — React Compiler noise off, hooks warn).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    settings: {
      next: {
        rootDir: [
          resolve(monorepoRoot, "apps/application"),
          resolve(monorepoRoot, "apps/website"),
        ],
      },
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      ...sharedRules,
      // Next.js 16 React Compiler — too strict for current codebase (Meltizo)
      "react-hooks/static-components": "off",
      "react/no-unstable-nested-components": "off",
      "react/jsx-no-constructed-context-values": "off",
      "@next/next/no-html-link-for-pages": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
    },
  },
  pluginReactHooks.configs.flat.recommended,
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "jsx-a11y": pluginJsxA11y,
    },
    rules: jsxA11yWarnRules,
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      tailwindcss: pluginTailwindcss,
    },
    settings: {
      tailwindcss: {
        cssConfigPath: tailwindCssConfigPath,
      },
    },
    rules: {
      ...pluginTailwindcss.configs.recommended.rules,
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/enforces-shorthand": "warn",
      "tailwindcss/no-custom-classname": "warn",
    },
  },
];
