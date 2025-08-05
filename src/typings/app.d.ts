declare namespace App {

  namespace Theme {
    type ColorPaletteNumber = import('@ca/color').ColorPaletteNumber

    interface ThemeSetting {
      themeScheme: UnionKey.ThemeScheme
      grayscale: boolean
      colorWeakness: boolean
      recommendColor: boolean
      themeColor: string
      otherColor: OtherColor
      isInfoFollowPrimary: boolean
      resetCacheStrategy: UnionKey.ResetCacheStrategy
      layout: {
        mode: UnionKey.ThemeLayoutMode
        scrollMode: UnionKey.ThemeScrollMode
        reverseHorizontalMix: boolean
      }
      page: {
        animate: boolean
        animateMode: UnionKey.ThemePageAnimateMode
      }
      header: {
        height: number
        breadcrumb: {
          visible: boolean
          showIcon: boolean
        }
        multilingual: {
          visible: boolean
        }
        globalSearch: {
          visible: boolean
        }
      }
      tab: {
        visible: boolean
        cache: boolean
        height: number
        mode: UnionKey.ThemeTabMode
      }
      fixedHeaderAndTab: boolean
      sider: {
        inverted: boolean
        width: number
        collapsedWidth: number
        mixWidth: number
        mixCollapsedWidth: number
        mixChildMenuWidth: number
      }
      footer: {
        visible: boolean
        fixed: boolean
        height: number
        right: boolean
      }
      watermark: {
        visible: boolean
        text: string
        enableUserName: boolean
      }
      tokens: {
        light: ThemeSettingToken
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>
        }
      }
    }

    interface OtherColor {
      info: string
      success: string
      warning: string
      error: string
    }

    interface ThemeColor extends OtherColor {
      primary: string
    }

    type ThemeColorKey = keyof ThemeColor

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string
    }

    type BaseToken = Record<string, Record<string, string>>

    interface ThemeSettingTokenColor {
      'nprogress'?: string
      'container': string
      'layout': string
      'inverted': string
      'base-text': string
    }

    interface ThemeSettingTokenBoxShadow {
      header: string
      sider: string
      tab: string
    }

    interface ThemeSettingToken {
      colors: ThemeSettingTokenColor
      boxShadow: ThemeSettingTokenBoxShadow
    }

    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor

    type ThemeTokenCSSVars = {
      colors: ThemeTokenColor & { [key: string]: string }
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string }
    }
  }

  namespace I18n {
    type LangType = 'en-US' | 'zh-CN'

    type LangOption = {
      label: string
      key: string
    }

    type Schema = {
      system: {
        title: string
      }
    }

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never

    type I18nKey = GetI18nKey<Schema>

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>

    interface $T {
      (key: I18nKey): string
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string
      (key: I18nKey, list: unknown[], plural: number): string
      (key: I18nKey, list: unknown[], defaultMsg: string): string
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string
      (key: I18nKey, named: Record<string, unknown>, plural: number): string
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string
    }
  }
}
