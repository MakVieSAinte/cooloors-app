// Générateur de palettes harmonieuses inspiré de Coolors
// Utilise chroma-js pour la génération et l'harmonisation
import chroma from "chroma-js";

export type HarmonyType =
  | "analogous"
  | "monochromatic"
  | "complementary"
  | "triad"
  | "tetrad"
  | "random";

export function generatePalette(
  baseColor: string = chroma.random().hex(),
  count: number = 5,
  harmony: HarmonyType = "analogous",
): string[] {
  let colors: string[] = [];
  switch (harmony) {
    case "analogous":
      colors = chroma.scale(chroma(baseColor).analogous(count)).mode("lab").colors(count);
      break;
    case "monochromatic":
      colors = chroma
        .scale([chroma(baseColor).brighten(2), baseColor, chroma(baseColor).darken(2)])
        .mode("lab")
        .colors(count);
      break;
    case "complementary":
      colors = [baseColor, chroma(baseColor).set("hsl.h", "+180").hex()];
      colors = chroma.scale(colors).mode("lab").colors(count);
      break;
    case "triad":
      colors = chroma.scale(chroma(baseColor).set("hsl.h", "+120").hex()).mode("lab").colors(count);
      colors.unshift(baseColor);
      colors = chroma.scale(colors).mode("lab").colors(count);
      break;
    case "tetrad":
      const tetrad = chroma(baseColor).set("hsl.h", "+90").hex();
      colors = [
        baseColor,
        tetrad,
        chroma(baseColor).set("hsl.h", "+180").hex(),
        chroma(baseColor).set("hsl.h", "+270").hex(),
      ];
      colors = chroma.scale(colors).mode("lab").colors(count);
      break;
    case "random":
    default:
      colors = Array.from({ length: count }, () => chroma.random().hex());
      break;
  }
  return colors.map((c) => chroma(c).hex());
}
