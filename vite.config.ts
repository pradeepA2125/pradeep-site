import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages serves a project repo from a subpath
  // (/pradeep-site/), so the build needs a matching base. Root-hosted
  // targets (Cloudflare Pages, a custom domain) leave VITE_BASE unset
  // and get "/" — the default stays correct for the simple case.
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
});
