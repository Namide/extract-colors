import { UserConfig } from "vite";

export default {
  define: {
    __DEV__: "true",
    __BROWSER__: "true",
  },
  publicDir: '/display/public',
  root: "display",
  server: {
    port: 3002,
    host: true,

    // To bypass external images CORS
    proxy: {
      "/img-proxy": {
        changeOrigin: true,
        target: "https://example.com",
        rewrite(path) {
          const proxyUrl = new URL(path, "file:"),
            url = new URL(proxyUrl.searchParams.get("url") || "");
          return url.pathname + url.search;
        },
        configure(proxy, options) {
          proxy.on("proxyReq", (proxyReq, req) => {
            const query = req["_parsedUrl"]["query"],
              url = new URL(new URLSearchParams(query).get("url") || "");
            options.target = url.origin;
          });
        },
      },
    },
  },
} satisfies UserConfig;
