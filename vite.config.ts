import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ 
      include: ['buffer', 'assert', 'net', 'http', 'events', 'url', 'stream', 'zlib', 'crypto', 'console', 'querystring'],
      protocolImports: true,
      globals: {
        Buffer: true,
      },
    }),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'react-lumera-sdk',
      formats: ['es'],
      fileName: (format) => `react-lumera-sdk.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      onwarn(warning, defaultHandler) {
        if (warning.code === 'MODULE_MARKED_AS_EXTERNAL') {
          return;
        }
        defaultHandler(warning);
      },
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: (assetInfo) => {
          const isImage = assetInfo.name?.endsWith('.svg') || assetInfo.name?.endsWith('.png');
          if (isImage) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    assetsInlineLimit: 0,
  },
});