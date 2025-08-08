declare namespace StorageType {
  interface Session {
    themeColor: string
  }

  interface Local {
    lang: App.I18n.LangType
    token: string
    mixSiderFixed: CommonType.YesOrNo
    refreshToken: string
    themeColor: string
    darkMode: boolean
    themeSettings: App.Theme.ThemeSetting
    overrideThemeFlag: string
    backupThemeSettingBeforeIsMobile: {
      layout: UnionKey.ThemeLayoutMode
      siderCollapse: boolean
    }
    lastLoginUserId: string
  }
}
