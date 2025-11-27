import {defineConfig, loadEnv} from "vite";
import {resolve} from "path";
import progress from "vite-plugin-progress";
import react from "@vitejs/plugin-react";
import {visualizer} from "rollup-plugin-visualizer";
import federation from "@dilesoft/vite-plugin-federation-dynamic";

export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      progress(),
      visualizer(),
      federation({
        name: "app",
        remotes: {
          remote_webpage_app: `${env.WEBPAGE_REMOTE_APP_URL}/assets/remoteEntry.js`,
        },
      }),
    ],
    publicDir: "src",
    build: {
      outDir: "build",
      minify: "esbuild",
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
    },
    server: {
      port: 7777,
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
      ],
    },
  };
});
