import { default as nextConfig } from "eslint-config-next";
import coreWebVitals from "eslint-config-next/core-web-vitals";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextConfig,
  ...coreWebVitals,
];

export default eslintConfig;
