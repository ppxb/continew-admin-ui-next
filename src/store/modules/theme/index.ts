import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { computed, effectScope, onScopeDispose, ref, toRefs, watch } from 'vue'
import { useEventListener, usePreferredColorScheme } from '@vueuse/core'

import { StoreId } from '@/enum'
import {
  addThemeVarsToGlobal,
  createThemeToken,
  getNaiveTheme,
  initThemeSettings,
  toggleAuxiliaryColorModes,
  toggleCssDarkMode,
} from './shared'
import { getPaletteColorByNumber } from '~/packages/color/src'
import { localStg } from '@/utils/storage'

export const useThemeStore = defineStore(StoreId.Theme, () => {
  const scope = effectScope()
  const osTheme = usePreferredColorScheme()

  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings())

  const darkMode = computed(() => {
    if (settings.value.themeScheme === 'auto') {
      return osTheme.value === 'dark'
    }
    return settings.value.themeScheme === 'dark'
  })

  const grayscaleMode = computed(() => settings.value.grayscale)

  const colorWeaknessMode = computed(() => settings.value.colorWeakness)

  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value
    const colors: App.Theme.ThemeColor = {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info,
    }
    return colors
  })

  const naiveTheme = computed(() =>
    getNaiveTheme(themeColors.value, settings.value.recommendColor)
  )

  const settingsJson = computed(() => JSON.stringify(settings.value))

  function resetStore() {
    const themeStore = useThemeStore()
    themeStore.$reset()
  }

  function setThemeScheme(themeScheme: UnionKey.ThemeScheme) {
    settings.value.themeScheme = themeScheme
  }

  function setGrayscale(isGrayscale: boolean) {
    settings.value.grayscale = isGrayscale
  }

  function setColorWeakness(isColorWeakness: boolean) {
    settings.value.colorWeakness = isColorWeakness
  }

  function toggleThemeScheme() {
    const themeSchemes: UnionKey.ThemeScheme[] = ['light', 'dark', 'auto']

    const index = themeSchemes.findIndex(
      item => item === settings.value.themeScheme
    )

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1

    const nextThemeScheme = themeSchemes[nextIndex]

    setThemeScheme(nextThemeScheme)
  }

  function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    let colorValue = color

    if (settings.value.recommendColor) {
      colorValue = getPaletteColorByNumber(color, 500, true)!
    }

    if (key === 'primary') {
      settings.value.themeColor = colorValue
    }
    else {
      settings.value.otherColor[key] = colorValue
    }
  }

  function setThemeLayout(mode: UnionKey.ThemeLayoutMode) {
    settings.value.layout.mode = mode
  }

  function setupThemeVarsToGlobal() {
    const { themeTokens, darkThemeTokens } = createThemeToken(
      themeColors.value,
      settings.value.tokens,
      settings.value.recommendColor
    )
    addThemeVarsToGlobal(themeTokens, darkThemeTokens)
  }

  function setLayoutReverseHorizontalMix(reverse: boolean) {
    settings.value.layout.reverseHorizontalMix = reverse
  }

  function cacheThemeSetting() {
    if (!import.meta.env.PROD) {
      return
    }

    localStg.set('themeSettings', settings.value)
  }

  useEventListener(window, 'beforeunload', () => {
    cacheThemeSetting()
  })

  scope.run(() => {
    watch(
      darkMode,
      (val) => {
        toggleCssDarkMode(val)
        localStg.set('darkMode', val)
      },
      {
        immediate: true,
      }
    )

    watch(
      [grayscaleMode, colorWeaknessMode],
      (val) => {
        toggleAuxiliaryColorModes(val[0], val[1])
      },
      {
        immediate: true,
      }
    )

    watch(
      themeColors,
      (val) => {
        setupThemeVarsToGlobal()
        localStg.set('themeColor', val.primary)
      },
      {
        immediate: true,
      }
    )
  })

  onScopeDispose(scope.stop)

  return {
    ...toRefs(settings.value),
    darkMode,
    themeColors,
    naiveTheme,
    settingsJson,
    setGrayscale,
    setColorWeakness,
    resetStore,
    setThemeScheme,
    toggleThemeScheme,
    updateThemeColors,
    setThemeLayout,
    setLayoutReverseHorizontalMix,
  }
})
