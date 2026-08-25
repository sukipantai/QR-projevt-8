let currentTab = 'wifi';
let qrInstance = null;

// Fungsi mengganti tab input
function switchTab(tab) {
  currentTab = tab;
  const wifiForm = document.getElementById('form-wifi');
  const linkForm = document.getElementById('form-link');
  const tabBtns = document.querySelectorAll('.tab-btn');

  if (tab === 'wifi') {
    wifiForm.style.display = 'block';
    linkForm.style.display = 'none';
    tabBtns[0].classList.add('active');
    tabBtns[1].classList.remove('active');
  } else {
    wifiForm.style.display = 'none';
    linkForm.style.display = 'block';
    tabBtns[0].classList.remove('active');
    tabBtns[1].classList.add('active');
  }
}

// Fungsi generate QR Code
function generateQR() {
  let qrText = '';

  if (currentTab === 'wifi') {
    const ssid = document.getElementById('wifi-ssid').value.trim();
    const pass = document.getElementById('wifi-pass').value.trim();

    if (!ssid) {
      alert('Mohon isi nama Wi-Fi');
      return;
    }
    // Protokol standar Wi-Fi untuk Android & iOS
    qrText = `WIFI:S:${ssid};T:WPA;P:${pass};;`;
  } else {
    const link = document.getElementById('link-url').value.trim();
    if (!link) {
      alert('Mohon isi link/URL');
      return;
    }
    qrText = link;
  }

  // Bersihkan QR Code lama
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = '';

  // Render QR Code baru
  qrInstance = new QRCode(qrContainer, {
    text: qrText,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // Tampilkan container hasil
  document.getElementById('result-area').style.display = 'flex';
}

// Fungsi membuat gambar kartu siap cetak dan mengunduhnya
function downloadQR() {
  const qrContainer = document.getElementById('qrcode');
  const qrCanvas = qrContainer.querySelector('canvas');
  const qrImg = qrContainer.querySelector('img');

  const qrSource = qrCanvas || qrImg;
  if (!qrSource) {
    alert('Silakan buat QR Code terlebih dahulu.');
    return;
  }

  // Daftar tema warna
  const selectedTheme = document.getElementById('card-theme').value;
  const themeColors = {
    coffee: {
      border: '#6f4e37',
      banner: '#4a3525',
      bannerText: '#f5ebe0',
      accent: '#6f4e37'
    },
    green: {
      border: '#2e7d32',
      banner: '#1b5e20',
      bannerText: '#ffffff',
      accent: '#2e7d32'
    },
    blue: {
      border: '#1565c0',
      banner: '#0d47a1',
      bannerText: '#ffffff',
      accent: '#1565c0'
    },
    dark: {
      border: '#222222',
      banner: '#222222',
      bannerText: '#ffffff',
      accent: '#333333'
    }
  };

  const theme = themeColors[selectedTheme];

  // Siapkan canvas kartu virtual (400 x 540 piksel)
  const cardCanvas = document.createElement('canvas');
  const ctx = cardCanvas.getContext('2d');
  cardCanvas.width = 400;
  cardCanvas.height = 540;

  // 1. Latar belakang kartu
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, cardCanvas.width, cardCanvas.height);

  // 2. Banner Atas
  ctx.fillStyle = theme.banner;
  ctx.fillRect(12, 12, cardCanvas.width - 24, 85);

  // 3. Garis Bingkai
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, cardCanvas.width - 24, cardCanvas.height - 24);

  // 4. Teks Header
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.bannerText;
  ctx.font = 'bold 20px Arial';

  if (currentTab === 'wifi') {
    ctx.fillText('SCAN WI-FI DI SINI', 200, 50);
    ctx.font = '13px Arial';
    ctx.fillText('Hubungkan internet otomatis tanpa ketik', 200, 75);
  } else {
    ctx.fillText('PINDAI KODE QR', 200, 50);
    ctx.font = '13px Arial';
    ctx.fillText('Arahkan kamera HP Anda ke kode di bawah', 200, 75);
  }

  // 5. Render Gambar QR Code di Tengah
  ctx.drawImage(qrSource, 75, 120, 250, 250);

  // 6. Footer Info
  if (currentTab === 'wifi') {
    const ssid = document.getElementById('wifi-ssid').value.trim();
    const pass = document.getElementById('wifi-pass').value.trim();

    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Wi-Fi: ${ssid}`, 200, 405);

    ctx.fillStyle = '#444444';
    ctx.font = '14px Arial';
    ctx.fillText(`Password: ${pass || '(Tanpa Sandi)'}`, 200, 435);
  } else {
    ctx.fillStyle = theme.accent;
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Terima Kasih atas Kunjungan Anda!', 200, 420);
  }

  // Catatan kaki
  ctx.font = 'italic 11px Arial';
  ctx.fillStyle = '#888888';
  ctx.fillText('Buka kamera HP atau Google Lens untuk memindai', 200, 500);

  // 7. Eksekusi Unduhan PNG
  const downloadLink = document.createElement('a');
  downloadLink.href = cardCanvas.toDataURL('image/png');
  downloadLink.download = `kartu-qr-${selectedTheme}-${currentTab}.png`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
