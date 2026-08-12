import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/lib/mockBackend.ts"],
      exclude: ["src/lib/error-capture.ts", "src/lib/error-page.ts", "src/lib/lovable-error-reporting.ts", "src/lib/utils.ts"],
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
