/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // add more env vars here if you need them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
