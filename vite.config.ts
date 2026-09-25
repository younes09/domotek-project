import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    modulePreload: {
      // Éviter de précharger les modules lourds de l'administration sur la page d'accueil visiteur
      resolveDependencies(filename, deps) {
        return deps.filter((dep) => !dep.includes("Admin") && !dep.includes("charts"));
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/recharts")) {
            return "charts";
          }
          if (id.includes("node_modules/@supabase")) {
            return "supabase-vendor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
});
