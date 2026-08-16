import { config } from "@repo/eslint-config/base"

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    files: ["src/**/*.test.ts"],
    rules: {
      "turbo/no-undeclared-env-vars": "off",
    },
  },
  {
    files: ["src/env.ts"],
    rules: {
      "turbo/no-undeclared-env-vars": "off",
    },
  },
]
