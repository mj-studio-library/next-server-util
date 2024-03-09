/* eslint-disable @typescript-eslint/no-var-requires */
// const babel = require('@rollup/plugin-babel');
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// import * as postcss from 'rollup-plugin-postcss';
import ts from 'rollup-plugin-typescript2';

export default [
  {
    input: 'index.ts',
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        preserveModules: true,
      },
      {
        dir: 'esm',
        format: 'esm',
        preserveModules: true,
      },
    ],
    plugins: [
      nodeResolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
      commonjs(),
      peerDepsExternal(),
      ts({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },
];
