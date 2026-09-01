import importPlugin from "eslint-plugin-import";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

/** Galighticus-style unused vars — replaces @typescript-eslint/no-unused-vars. */
export const unusedVarRules = {
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": "off",
  "unused-imports/no-unused-imports": "error",
  "unused-imports/no-unused-vars": [
    "error",
    {
      vars: "all",
      varsIgnorePattern: "^_",
      args: "after-used",
      argsIgnorePattern: "^_",
    },
  ],
};

/** Import resolution + duplicate import guard. */
export const importRules = {
  "import/no-duplicates": "error",
  "import/order": "off",
  "import/no-unresolved": [
    "error",
    {
      commonjs: true,
      caseSensitive: true,
      ignore: ["server-only"],
    },
  ],
};

/** Imports only — objects/JSX props sorting stay off (Galighticus library). */
export const perfectionistImportRules = {
  "perfectionist/sort-imports": [
    "warn",
    {
      type: "natural",
      order: "asc",
      groups: [
        "type",
        "react",
        "next",
        "rumbelo",
        ["builtin", "external"],
        "internal-type",
        "internal",
        ["parent-type", "sibling-type", "index-type"],
        ["parent", "sibling", "index"],
        "side-effect",
        "style",
        "object",
        "unknown",
      ],
      customGroups: {
        value: {
          react: ["react", "react-*"],
          next: ["next", "next-*"],
          rumbelo: ["@rumbelo/*"],
        },
        type: {
          react: ["react", "react-*"],
          next: ["next", "next-*"],
        },
      },
      newlinesBetween: "always",
      internalPattern: ["^@/", "^@rumbelo/"],
    },
  ],
};

const importResolverSettings = {
  "import/resolver": {
    typescript: {
      alwaysTryTypes: true,
      project: "./tsconfig.json",
    },
    node: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"],
    },
  },
};

/**
 * Shared import / unused / sort-import hygiene for TS sources.
 *
 * @type {import("eslint").Linter.Config}
 */
export const hygieneConfig = {
  files: ["**/*.{ts,tsx}"],
  plugins: {
    import: importPlugin,
    "unused-imports": unusedImportsPlugin,
    perfectionist: perfectionistPlugin,
  },
  settings: importResolverSettings,
  rules: {
    ...unusedVarRules,
    ...importRules,
    ...perfectionistImportRules,
  },
};
