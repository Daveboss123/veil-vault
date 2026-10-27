import QRCode from 'qrcode'
await QRCode.toFile('public/cta-qr.png', 'https://veil-vault-game.vercel.app/', {
  width: 640,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: { dark: '#0b120d', light: '#f2efe2' },
})
console.log('wrote public/cta-qr.png')
