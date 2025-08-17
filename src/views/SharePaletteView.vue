<template>
  <div class="share-page">
    <header class="share-header">
      <h1>Palette partagée</h1>
      <p v-if="!validColors.length" class="error">Lien invalide ou palette vide.</p>
    </header>

    <section class="actions">
      <button class="btn" @click="copyLink">Copier le lien</button>
      <button class="btn primary" :disabled="!validColors.length" @click="importToApp">Importer dans l’app</button>
      <button class="btn" :disabled="!validColors.length" @click="downloadPDF">Télécharger PDF</button>
    </section>

    <section class="grid" aria-label="Aperçu de la palette">
      <div
        v-for="(c, i) in filledColors"
        :key="i + (c || 'empty')"
        class="tile"
        :style="tileStyle(c)"
      >
        <span v-if="c" class="hex" :style="{ color: getContrastText(c) }">{{ c.replace('#','').toUpperCase() }}</span>
        <span v-else class="placeholder">Vide</span>
      </div>
    </section>

    <footer class="share-footer">
      <router-link to="/" class="link">← Retour à l’accueil</router-link>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useColorStore } from '../stores/colorStore'
import jsPDF from 'jspdf'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const store = useColorStore()

const colorsParam = route.params.colors as string | undefined
const validColors = computed<string[]>(() => {
  if (!colorsParam) return []
  return decodeURIComponent(colorsParam)
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^#?[0-9a-fA-F]{6}$/.test(s))
    .map((s) => (s.startsWith('#') ? s : `#${s}`))
})

// 6 cases: remplir avec null si moins de 6
const filledColors = computed<(string | null)[]>(() => {
  const cols: (string | null)[] = [...validColors.value.slice(0, 6)]
  while (cols.length < 6) cols.push(null)
  return cols
})

function tileStyle(c: string | null) {
  if (c) {
    return {
      background: c,
      border: '1px solid rgba(0,0,0,0.08)',
    }
  }
  return {
    background: 'transparent',
    border: '1.5px dashed rgba(0,0,0,0.25)',
  }
}

function getContrastText(hex: string) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#222' : '#fff'
}

async function copyLink() {
  const text = window.location.href
  let ok = false
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      ok = true
    }
  } catch {}
  if (!ok) {
    // Fallback: textarea invisible
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    try { ok = document.execCommand('copy') } catch { ok = false }
    document.body.removeChild(ta)
  }
  if (ok) {
    toast.success('Lien copié !', { richColors: true })
  } else {
    toast.error("Impossible de copier le lien", { richColors: true })
  }
}

function importToApp() {
  if (!validColors.value.length) return
  store.setColors(validColors.value)
  router.push('/')
}

function downloadPDF() {
  if (!validColors.value.length) return
  const pdfW = 1091
  const pdfH = 768
  const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [pdfW, pdfH] })
  doc.setFont('helvetica', 'normal')

  const marginX = 24
  const marginY = 24
  const gap = 16
  const footerReserve = 56
  const cellW = Math.floor((pdfW - marginX * 2 - gap * 2) / 3)
  const cellH = Math.floor((pdfH - marginY * 2 - gap - footerReserve) / 2)
  const startX = marginX
  const startY = marginY

  for (let i = 0; i < 6; i++) {
    const row = Math.floor(i / 3)
    const col = i % 3
    const x = startX + col * (cellW + gap)
    const y = startY + row * (cellH + gap)
    const color = validColors.value[i]
    if (color) {
      doc.setFillColor(color)
      doc.roundedRect(x, y, cellW, cellH, 28, 28, 'F')
      doc.setFontSize(28)
      doc.setTextColor(getContrastText(color))
      doc.text(color.replace('#', '').toUpperCase(), x + 22, y + cellH - 22)
    } else {
      doc.setDrawColor('#CCCCCC')
      doc.setLineWidth(1)
      doc.roundedRect(x, y, cellW, cellH, 28, 28, 'S')
    }
  }

  const footerText = 'make with Kolor'
  const footerFontSize = 18
  const padding = 32
  doc.setFontSize(footerFontSize)
  doc.setTextColor('#111111')
  doc.text(footerText, pdfW - padding, pdfH - padding, { align: 'right' })

  doc.save('palette.pdf')
}
</script>

<style scoped>
.share-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px 20px 28px;
  min-height: 100vh;
  overflow-y: auto;
}
.share-header h1 {
  font-size: 1.5rem;
  margin: 0 0 8px;
}
.share-header .error {
  color: #b00020;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 12px 0 20px;
}
.btn {
  appearance: none;
  border: 1px solid rgba(0,0,0,0.12);
  background: #fff;
  color: #111;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}
.btn.primary {
  background: #111;
  color: #fff;
  border-color: #111;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.tile {
  position: relative;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
}
.hex {
  position: absolute;
  left: 16px;
  bottom: 14px;
  font-weight: 600;
  letter-spacing: 0.6px;
}
.placeholder {
  position: absolute;
  left: 16px;
  bottom: 14px;
  color: rgba(0,0,0,0.5);
}
.share-footer {
  margin-top: 18px;
}
.share-footer .link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dashed currentColor;
}

@media (max-width: 780px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .tile { height: 160px; }
}
</style>
