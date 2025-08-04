declare global {
  export interface Window {
    NProgress?: import('nprogress').NProgress
    $loadingBar?: import('naive-ui').LoadingBarProviderInst
    $dialog?: import('naive-ui').DialogProviderInst
    $message?: import('naive-ui').MessageProviderInst
    $notification?: import('naive-ui').NotificationProviderInst
  }

  export const BUILD_TIME: string
}

export {}
