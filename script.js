let currentTab = 'wifi';
let currentTheme = 'coffee';
let qrCodeInstance = null;

// Konfigurasi Palet Warna HD untuk Canvas & Preview
const THEME_PALETTES = {
  coffee: {
    banner: '#3e2723',
    bannerText: '#f5ebe0',
    border: '#5d4037',
    accent: '#5d4037',
    name: 'Warkop Klasik'
  },
  emerald: {
    banner: '#064e3b',
    bannerText: '#ffffff',
    border: '#047857',
    accent: '#047857',
    name: 'Warung Segar'
  },
  ocean: {
    banner: '#0c4a6e',
    bannerText: '#ffffff',
    border: '#0284c7',
    accent: '#0369a1',
    name: 'Modern Biru'
  },
  midnight: {
    banner: '#0f172a',
    bannerText: '#ffffff',
    border: '#334155',
    accent: '#1e293b',
    name: 'Dark Elegan'
  }
};

// Inisialisasi saat web pertama kali dibuka
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('wifi-ssid').value = 'Warkop Berkah Free';
  document.getElementById('wifi-pass').value = 'kopihitam123';
  updateLivePreview();
});

// Ganti Tab Wi-Fi vs Link dengan Efek Pop-Up di Form Maupun Kartu Preview
function switchTab(tab) {
  if (currentTab === tab) return;
  currentTab = tab;

  const wifiForm = document.getElementById('form-wifi');
  const linkForm = document.getElementById('form-link');
  const segmentBtns = document.querySelectorAll('.segment-btn');
  const cardMockup = document.getElementById('card-mockup');

  // Bersihkan class animasi sebelumnya
  wifiForm.classList.remove('tab-animating');
  linkForm.classList.remove('tab-animating');
  cardMockup.classList.remove('mockup-pop');

  if (tab === 'wifi') {
    linkForm.style.display = 'none';
    wifiForm.style.display = 'block';

    // Memicu browser agar memutar ulang animasi Form Kiri
    void wifiForm.offsetWidth;
    wifiForm.classList.add('tab-animating');

    segmentBtns[0].classList.add('active');
    segmentBtns[1].classList.remove('active');
  } else {
    wifiForm.style.display = 'none';
    linkForm.style.display = 'block';

    // Memicu browser agar memutar ulang animasi Form Kiri
    void linkForm.offsetWidth;
    linkForm.classList.add('tab-animating');

    segmentBtns[0].classList.remove('active');
    segmentBtns[1].classList.add('active');

    if (!document.getElementById('link-url').value) {
      document.getElementById('link-url').value = 'https://maps.google.com';
    }
  }

  // Memicu browser agar memutar ulang animasi Pop-Up pada Kartu Kanan
  void cardMockup.offsetWidth;
  cardMockup.classList.add('mockup-pop');

  updateLivePreview();
}

// Ganti Tema Warna
function setTheme(themeKey) {
  currentTheme = themeKey;
  const themeChips = document.querySelectorAll('.theme-chip');
  themeChips.forEach(chip => {
    chip.classList.toggle('active', chip.classList.contains(`theme-${themeKey}`));
  });

  const palette = THEME_PALETTES[themeKey];
  const cardMockup = document.getElementById('card-mockup');
  const banner = cardMockup.querySelector('.mockup-banner');
  const mainText = document.getElementById('mock-footer-main');

  cardMockup.style.borderColor = palette.border;
  banner.style.backgroundColor = palette.banner;
  mainText.style.color = palette.accent;

  // Efek pop ringan saat ganti warna tema
  cardMockup.classList.remove('mockup-pop');
  void cardMockup.offsetWidth;
  cardMockup.classList.add('mockup-pop');
}

// Update UI Mockup & Render Ulang QR Secara Real-Time
function updateLivePreview() {
  let qrPayload = '';
  const titleEl = document.getElementById('mock-header-title');
  const subEl = document.getElementById('mock-header-sub');
  const mainTextEl = document.getElementById('mock-footer-main');
  const secTextEl = document.getElementById('mock-footer-sub');

  if (currentTab === 'wifi') {
    const ssid = document.getElementById('wifi-ssid').value.trim() || 'Nama Wi-Fi';
    const pass = document.getElementById('wifi-pass').value.trim();

    titleEl.textContent = 'SCAN WI-FI DI SINI';
    subEl.textContent = 'Hubungkan internet otomatis tanpa ketik';
    mainTextEl.textContent = `Wi-Fi: ${ssid}`;
    secTextEl.textContent = pass ? `Password: ${pass}` : 'Password: (Tanpa Sandi)';
    secTextEl.style.display = 'block';

    qrPayload = `WIFI:S:${ssid};T:WPA;P:${pass};;`;
  } else {
    const url = document.getElementById('link-url').value.trim() || 'https://maps.google.com';

    titleEl.textContent = 'PINDAI KODE QR';
    subEl.textContent = 'Arahkan kamera HP ke kode di bawah';
    mainTextEl.textContent = 'Selamat Datang!';
    secTextEl.textContent = 'Katalog & Layanan Online';

    qrPayload = url;
  }

  // Render QR Code di Mockup dengan Animasi Pop
  const qrContainer = document.getElementById('qrcode-render');
  qrContainer.innerHTML = '';
  qrContainer.classList.remove('qr-pop');
  void qrContainer.offsetWidth;
  qrContainer.classList.add('qr-pop');

  qrCodeInstance = new QRCode(qrContainer, {
    text: qrPayload,
    width: 170,
    height: 170,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

// Download Kartu High-Definition (Resolusi Tinggi 800 x 1080 px untuk Cetak Tajam)
function downloadHDCard() {
  const qrContainer = document.getElementById('qrcode-render');
  const qrSource = qrContainer.querySelector('canvas') || qrContainer.querySelector('img');

  if (!qrSource) {
    alert('QR Code belum siap diunduh.');
    return;
  }

  const palette = THEME_PALETTES[currentTheme];

  // Siapkan Kanvas HD (800 x 1080 px agar cetakan tajam)
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 1080;

  // 1. Background Putih Bersih
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Banner Header Berwarna
  ctx.fillStyle = palette.banner;
  ctx.fillRect(24, 24, canvas.width - 48, 170);

  // 3. Garis Bingkai Luar
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  // 4. Teks Header
  ctx.textAlign = 'center';
  ctx.fillStyle = palette.bannerText;
  ctx.font = 'bold 40px Plus Jakarta Sans, Arial';

  if (currentTab === 'wifi') {
    ctx.fillText('SCAN WI-FI DI SINI', 400, 100);
    ctx.font = '24px Plus Jakarta Sans, Arial';
    ctx.fillText('Hubungkan internet otomatis tanpa ketik', 400, 148);
  } else {
    ctx.fillText('PINDAI KODE QR', 400, 100);
    ctx.font = '24px Plus Jakarta Sans, Arial';
    ctx.fillText('Arahkan kamera HP ke kode di bawah', 400, 148);
  }

  // 5. Render Gambar QR Code di Tengah Kanvas
  ctx.drawImage(qrSource, 150, 240, 500, 500);

  // 6. Footer Info
  if (currentTab === 'wifi') {
    const ssid = document.getElementById('wifi-ssid').value.trim() || 'Nama Wi-Fi';
    const pass = document.getElementById('wifi-pass').value.trim();

    ctx.fillStyle = palette.accent;
    ctx.font = 'bold 34px Plus Jakarta Sans, Arial';
    ctx.fillText(`Wi-Fi: ${ssid}`, 400, 810);

    ctx.fillStyle = '#475569';
    ctx.font = '28px Plus Jakarta Sans, Arial';
    ctx.fillText(`Password: ${pass || '(Tanpa Sandi)'}`, 400, 865);
  } else {
    ctx.fillStyle = palette.accent;
    ctx.font = 'bold 34px Plus Jakarta Sans, Arial';
    ctx.fillText('Terima Kasih atas Kunjungan Anda!', 400, 825);

    ctx.fillStyle = '#475569';
    ctx.font = '26px Plus Jakarta Sans, Arial';
    ctx.fillText('Katalog Menu & Info Pemesanan', 400, 875);
  }

  // Catatan Kaki Kecil
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 20px Plus Jakarta Sans, Arial';
  ctx.fillText('Buka kamera HP atau Google Lens untuk memindai', 400, 980);

  // 7. Eksekusi Download PNG
  const downloadLink = document.createElement('a');
  downloadLink.href = canvas.toDataURL('image/png', 1.0);
  downloadLink.download = `kartu-qr-${currentTheme}-${currentTab}.png`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
