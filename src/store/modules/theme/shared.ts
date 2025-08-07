import type { GlobalThemeOverrides } from 'naive-ui'
import defu from 'defu'

import { overrideThemeSettings, themeSettings } from '@/theme/settings'
import { localStg } from '@/utils/storage'
import { toggleHtmlClass } from '@/utils/common'
import { addColorAlpha, getColorPalette, getPaletteColorByNumber, getRgb } from '~/packages/color/src'
import { themeVars } from '@/theme/vars'
import { DARK_CLASS } from '@/constants/app'

export function initThemeSettings() {
  if (!import.meta.env.PROD) {
    return themeSettings
  }

  const localSettings = localStg.get('themeSettings')

  const settings = defu(localSettings, themeSettings)

  const isOverride = localStg.get('overrideThemeFlag') === BUILD_TIME

  if (!isOverride) {
    const overrideSettings = defu(overrideThemeSettings, settings)
    localStg.set('overrideThemeFlag', BUILD_TIME)
    return overrideSettings
  }

  return settings
}

export function createThemeToken(
  colors: App.Theme.ThemeColor,
  tokens?: App.Theme.ThemeSetting['tokens'],
  recommended = false
) {
  const paletteColors = createThemePaletteColors(colors, recommended)

  const { light, dark } = tokens || themeSettings.tokens

  const themeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...paletteColors,
      nprogress: paletteColors.primary,
      ...light.colors
    },
    boxShadow: {
      ...light.boxShadow
    }
  }

  const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...themeTokens.colors,
      ...dark?.colors
    },
    boxShadow: {
      ...themeTokens.boxShadow,
      ...dark?.boxShadow
    }
  }

  return {
    themeTokens,
    darkThemeTokens
  }
}

function createThemePaletteColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[]
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor

  colorKeys.forEach((key) => {
    const colorMap = getColorPalette(colors[key], recommended)
    colorPaletteVar[key] = colorMap.get(50)!

    colorMap.forEach((hex, number) => {
      colorPaletteVar[`${key}-${number}`] = hex
    })
  })

  return colorPaletteVar
}

function getCssVarByTokens(tokens: App.Theme.BaseToken): string {
  function removeVarPrefix(value: string) {
    return value.replace('var(', '').replace(')', '')
  }

  function removeRgbPrefix(value: string) {
    return value.replace('rgb(', '').replace(')', '')
  }

  const styles = Object.entries(themeVars).reduce<string[]>((result, [key, tokenValues]) => {
    Object.entries(tokenValues).forEach(([tokenKey, tokenValue]) => {
      let cssVarsKey = removeVarPrefix(tokenValue)
      let cssValue = tokens[key][tokenKey]

      if (key === 'colors') {
        cssVarsKey = removeRgbPrefix(cssVarsKey)
        const { r, g, b } = getRgb(cssValue)
        cssValue = `${r} ${g} ${b}`
      }

      result.push(`${cssVarsKey}: ${cssValue}`)
    })

    return result
  }, [])

  return styles.join(';')
}

export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  const cssVar = getCssVarByTokens(tokens)
  const darkCssVar = getCssVarByTokens(darkTokens)

  const css = `
    :root {
      ${cssVar}
    }
  `

  const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVar}
    }
  `

  const styleId = 'theme-vars'
  const style = document.querySelector(`#${styleId}`) || document.createElement('style')

  style.id = styleId
  style.textContent = css + darkCss

  document.head.appendChild(style)
}

export function toggleCssDarkMode(darkMode = false) {
  const { add, remove } = toggleHtmlClass('dark')

  if (darkMode) {
    add()
  }
  else {
    remove()
  }
}

export function toggleAuxiliaryColorModes(grayscaleMode = false, colorWeakness = false) {
  const htmlElement = document.documentElement
  htmlElement.style.filter = [grayscaleMode ? 'grayscale(100%)' : '', colorWeakness ? 'invert(80%)' : '']
    .filter(Boolean)
    .join(' ')
}

type NaiveColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active'

type NaiveColorKey = `${App.Theme.ThemeColorKey}Color${NaiveColorScene}`

type NaiveThemeColor = Partial<Record<NaiveColorKey, string>>

interface NaiveColorAction {
  scene: NaiveColorScene
  // TODO: SHOULD FIX THE TYPE DECLARATION
  handler: (color: string) => string | undefined
}

function getNaiveThemeColors(colors: App.Theme.ThemeColor, recommended = false) {
  const colorActions: NaiveColorAction[] = [
    { scene: '', handler: color => color },
    { scene: 'Suppl', handler: color => color },
    { scene: 'Hover', handler: color => getPaletteColorByNumber(color, 500, recommended) },
    { scene: 'Pressed', handler: color => getPaletteColorByNumber(color, 700, recommended) },
    { scene: 'Active', handler: color => addColorAlpha(color, 0.1) }
  ]

  const themeColors: NaiveThemeColor = {}

  const colorEntries = Object.entries(colors) as [App.Theme.ThemeColorKey, string][]

  colorEntries.forEach((color) => {
    colorActions.forEach((action) => {
      const [colorType, colorValue] = color
      const colorKey: NaiveColorKey = `${colorType}Color${action.scene}`
      themeColors[colorKey] = action.handler(colorValue)
    })
  })

  return themeColors
}

export function getNaiveTheme(colors: App.Theme.ThemeColor, recommended = false) {
  const { primary: colorLoading } = colors

  const theme: GlobalThemeOverrides = {
    common: {
      ...getNaiveThemeColors(colors, recommended),
      borderRadius: '6px'
    },
    LoadingBar: {
      colorLoading
    },
    Tag: {
      borderRadius: '6px'
    }
  }

  return theme
}
