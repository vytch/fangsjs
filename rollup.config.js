import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' }
    ],
    plugins: [
      del({ targets: ['dist/*'] }),
      typescript(),
    ],
    external: Object.keys(pkg.peerDependencies || {}),
  },
];
