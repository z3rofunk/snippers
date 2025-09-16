import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  rollup: {
    emitCJS: true,
    esbuild: {
      treeShaking: true,
    },
  },
  declaration: true,
  outDir: 'dist',
  clean: true,
  failOnWarn: true,
  entries: ['./src/index.ts', './src/types/index.ts'],
});
