/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./packages/config/tailwind/globals.css",
  tailwindFunctions: ["cn", "clsx", "cva"],
  tabWidth: 4,
  printWidth: 100,
  endOfLine: "auto",
  arrowParens: "avoid",
  trailingComma: "es5",
  semi: true,
  useTabs: false,
  singleQuote: true,
  bracketSpacing: true,
  bracketSameLine: true,
};
