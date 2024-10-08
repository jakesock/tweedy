const prettierConfig = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  printWidth: 100,
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  arrowParens: "always",
  useTabs: false,
  overrides: [
    {
      files: "LICENSE",
      options: { parser: "markdown" },
    },
  ],
};

module.exports = prettierConfig;
