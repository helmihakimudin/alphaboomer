const secretKey = "teman-edukatif-123";

function decryptName(encryptedText) {
  try {
    const bytes = CryptoJS.AES.decrypt(
      decodeURIComponent(encryptedText),
      secretKey
    );
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error("Decrypt Error:", error);
    return null;
  }
}

const params = new URLSearchParams(window.location.search);
const encryptedName = params.get("name");

const karakter = encryptedName ? decryptName(encryptedName) : null;

if (karakter) {
  fetch("/data/karakter.json")
    .then((res) => res.json())
    .then((data) => {
      const info = data[karakter];
      if (info) {
        document.getElementById("glbViewer").src = info.url;
        document.getElementById("judul").textContent = info.title;
        document.getElementById("desc").textContent = info.deskripsi;
        document.getElementById("license").innerHTML = info.license;
      } else {
        document.getElementById("judul").textContent =
          "Karakter tidak ditemukan";
        document.getElementById("desc").textContent =
          "Ups! Karakter yang kamu cari belum tersedia.";
      }
    })
    .catch(() => {
      document.getElementById("judul").textContent = "Gagal memuat data";
      document.getElementById("desc").textContent =
        "Silakan coba beberapa saat lagi.";
    });
} else {
  document.getElementById("judul").textContent = "Link tidak valid";
  document.getElementById("desc").textContent =
    "Parameter tidak bisa didekripsi.";
}
