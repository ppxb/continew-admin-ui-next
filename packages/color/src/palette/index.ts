import type { AnyColor } from 'colord'

import type { ColorPaletteNumber } from '../types'
import { getHex } from '../shared'
import { getRecommendedColorPalette } from './recommend'
import { getAntDColorPalette } from './antd'

export function getColorPalette(color: AnyColor, recommended = false) {
  const colorMap = new Map<ColorPaletteNumber, string>()

  if (recommended) {
    const colorPalette = getRecommendedColorPalette(getHex(color))
    colorPalette.palettes.forEach((palette) => {
      colorMap.set(palette.number, palette.hex)
    })
  }
  else {
    const colors = getAntDColorPalette(color)

    const colorNumbers: ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    colorNumbers.forEach((number, index) => {
      colorMap.set(number, colors[index])
    })
  }

  return colorMap
}

export function getPaletteColorByNumber(color: AnyColor, number: ColorPaletteNumber, recommended = false) {
  const colorMap = getColorPalette(color, recommended)

  return colorMap.get(number as ColorPaletteNumber)
}
