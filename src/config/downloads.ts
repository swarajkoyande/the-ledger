// Update these URLs when the desktop app files are ready.
// Options:
//   - Drop .dmg / .exe into public/downloads/ → use '/downloads/TheLedger-v1.0.dmg'
//   - Host on GitHub Releases → use the release asset URL
//   - Host on any CDN → use that URL
export const DOWNLOAD_URLS = {
  // Native macOS .dmg direct download. Left empty — the .dmg is 168 MB (over
  // Netlify's 100 MB cap), so it's hosted on GitHub Releases via `macGithub`.
  mac: '',
  // GitHub Releases-hosted .dmg (no size limit). Powers the secondary
  // "Download via GitHub" button on the Mac card.
  macGithub: '',
  // .exe is 74 MB — served directly from Netlify
  windows: '/downloads/TheLedger-Setup-1.0.0.exe',
}
