import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    if (confirm('Nouvelle version disponible. Recharger ?')) {
      window.location.reload()
    }
  },
  onOfflineReady() {
    console.log('L’application est prête à être utilisée hors ligne.')
  },
})
