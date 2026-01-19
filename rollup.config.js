import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

const onwarn = (warning) => {
  if (warning.code === 'CIRCULAR_DEPENDENCY') return

  console.warn(`(!) ${warning.message}`) // eslint-disable-line
}

export default {
  input: 'src/pptxtojson.js',
  onwarn,
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'pptxtojson',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),
    commonjs(),
    eslint(),
    babel({
      babelHelpers: 'runtime',
      exclude: ['node_modules/**'],
    }),
    terser(),
    globals(),
    builtins(),
  ],
}
