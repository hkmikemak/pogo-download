import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

import { terser } from "rollup-plugin-terser";

/** @type { import("rollup").RollupOptions } */
const config = {
  input: "./src/index.ts",
  output: {
    format: "cjs",
    file: "./dist/main.cjs",
  },
  // external: ["axios"],
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    typescript(),
    terser({
      ecma: 2020,
      format: {
        comments: false,
        ecma: 2020,
      },
    }),
  ],
};

export default config;
