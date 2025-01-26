/// <reference types="vite/client" />

interface ImportMetaGlob {
  [key: string]: {
    default: string
  }
}

interface ImportMeta {
  glob(pattern: string, options?: { eager: boolean }): ImportMetaGlob
}
