declare namespace StorageType {
  interface Session {
    themeColor: string
  }

  interface Local {
    lang: App.I18n.LangType
    token: string
    themeSettings: App.Theme.ThemeSetting
    overrideThemeFlag: string
  }
}
