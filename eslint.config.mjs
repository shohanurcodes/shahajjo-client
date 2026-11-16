import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Data pages fetch on mount and keep a local loading/error state, which is
      // exactly the pattern this new rule flags. The effects are intentional and
      // guarded against updates after unmount.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
