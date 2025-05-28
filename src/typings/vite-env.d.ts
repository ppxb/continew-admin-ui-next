declare namespace Env{
  type RouterHistoryMode = 'hash' | 'history' | 'memory'

  interface ImportMeta extends ImportMetaEnv {
    readonly VITE_BASE_URL: string
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_DESC: string

    readonly VITE_STORAGE_PREFIX?: string
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta
}
