import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import progress from "vite-plugin-progress";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import federation from "@dilesoft/vite-plugin-federation-dynamic"


export default defineConfig(({ command, mode }) => {

  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      progress(),
      visualizer(),
      federation({
        name: "app",
        remotes: {
          'remote_empty_app': {
            external:`new Promise(resolve=>resolve('https://empty-microfrontend.netlify.app/assets/remoteEntry.js'))`,
            externalType:"promise"
          },
          'remote_webpage_app': `${env.WEBPAGE_REMOTE_APP_URL}/assets/remoteEntry.js`
        },
        shared: ["react", "react-dom", "react-router-dom"]
      }),
    ],
    publicDir: "public",
    build: {
      outDir: "build",
      minify: "esbuild",
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      // rollupOptions: {
      //   input: {
      //     "firebase-messaging-sw": "public/firebase-messaging-sw.js",
      //   },
      // },
    },
    server: {
      port: 7777,
    },
    // esbuild: {
    //   drop: ['console'],
    // },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
      ],
    },
  }
});
