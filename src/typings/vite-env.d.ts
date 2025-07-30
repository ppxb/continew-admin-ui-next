declare namespace Env {
  /** 路由模式 */
  type RouterHistoryMode = 'hash' | 'history' | 'memory'

  interface ImportMeta extends ImportMetaEnv {
    /** 项目基础路径 */
    readonly VITE_BASE_URL: string
    /** 项目标题 */
    readonly VITE_APP_TITLE: string
    /** 项目描述 */
    readonly VITE_APP_DESC: string

    /** 是否启用 http proxy（只在开发模式适用） */
    readonly VITE_HTTP_PROXY?: CommonType.YesOrNo
    /** 是否在控制台中显示 proxy url 日志 */
    readonly VITE_HTTP_PROXY_LOG?: CommonType.YesOrNo
    /** 是否生成 sourceMap */
    readonly VITE_SOURCE_MAP?: CommonType.YesOrNo
    /** 用于却分不同区域的存储 */
    readonly VITE_STORAGE_PREFIX?: string
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta
}
