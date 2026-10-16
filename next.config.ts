import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Génère un serveur autonome dans .next/standalone (utilisé par l'image Docker)
  output: "standalone",
};

export default nextConfig;
