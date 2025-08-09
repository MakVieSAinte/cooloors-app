import namer from 'color-namer'

export function getColorName(hex: string): string {
  // color-namer attend un format #hex
  if (!hex.startsWith('#')) hex = '#' + hex
  const result = namer(hex)
  // Prend le nom le plus proche de la palette 'ntc' (plus universelle)
  if (result.ntc && result.ntc.length > 0) {
    return result.ntc[0].name
  }
  // Sinon fallback sur le premier nom trouvé
  const first = Object.values(result)[0]
  if (Array.isArray(first) && first.length > 0) {
    return first[0].name
  }
  return ''
}
