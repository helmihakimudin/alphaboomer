const secretKey = "teman-edukatif-123";
let currentUrl = "";

function generateUrl() {
  const karakter = document.getElementById("karakter").value.trim();
  const baseUrl = "https://alphaboomer.vercel.app/karakter";

  if (!karakter) {
    alert("Mohon masukkan nama karakter!");
    return;
  }

  const encrypted = CryptoJS.AES.encrypt(karakter, secretKey).toString();
  const encoded = encodeURIComponent(encrypted);
  const finalUrl = `${baseUrl}?name=${encoded}`;
  currentUrl = finalUrl;

  const resultEl = document.getElementById("result");
  resultEl.textContent = finalUrl;

  const container = document.getElementById("resultContainer");
  container.style.display = "block";

  generateQRCode(finalUrl);
}

function copyResult() {
  const resultEl = document.getElementById("result");
  const text = resultEl.textContent;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("URL berhasil disalin ke clipboard!");
      })
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const success = document.execCommand("copy");
    alert(
      success ? "URL berhasil disalin ke clipboard!" : "Gagal menyalin URL."
    );
  } catch {
    alert("Gagal menyalin URL.");
  }
  document.body.removeChild(textarea);
}

// function generateQRCode(url) {
//   const qrDiv = document.getElementById("qrcode");
//   qrDiv.innerHTML = ""; // Clear previous QR
//   new QRCode(qrDiv, {
//     text: url,
//     width: 3000,
//     height: 3000,
//     correctLevel: QRCode.CorrectLevel.H, // High error correction (good for printing)
//   });

//   const qrContainer = document.getElementById("qrContainer");
//   qrContainer.style.display = "block";
// }

function generateQRCode(url) {
  // === QR kecil untuk tampil di layar ===
  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = ""; // Clear previous QR
  new QRCode(qrDiv, {
    text: url,
    width: 200,
    height: 200,
    correctLevel: QRCode.CorrectLevel.H,
  });

  // === QR HD tersembunyi untuk download ===
  const hiddenDiv = document.getElementById("hiddenQR");
  hiddenDiv.innerHTML = ""; // Clear previous QR HD
  new QRCode(hiddenDiv, {
    text: url,
    width: 1000, // HD for printing
    height: 1000,
    correctLevel: QRCode.CorrectLevel.H,
  });

  // Tampilkan bagian QR
  const qrContainer = document.getElementById("qrContainer");
  qrContainer.style.display = "block";
}


// function downloadQR() {
//   const qrCanvas = document.querySelector("#qrcode canvas");
//   if (qrCanvas) {
//     const link = document.createElement("a");
//     link.href = qrCanvas.toDataURL("image/png");
//     link.download = "qrcode.png";
//     link.click();
//   } else {
//     alert("QR Code belum dibuat.");
//   }
// }

function downloadQR() {
  const name = document.getElementById("#karakter");
  const canvas = document.querySelector("#hiddenQR canvas");
  if (canvas) {
    const imageData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "qrcode_"+name+".png";
    link.click();
  } else {
    alert("QR Code HD tidak tersedia.");
  }
}


const AUTH_PASSWORD = "rahasia123"; // ganti password kamu
const AUTH_KEY = "authPassword";
const AUTH_EXPIRY = 3 * 60 * 60 * 1000; // 3 jam

const modal = document.getElementById("authModal");
const input = document.getElementById("authInput");
const submitBtn = document.getElementById("authSubmitBtn");
const errorMsg = document.getElementById("authDesc");

function checkAuth() {
  const authData = localStorage.getItem(AUTH_KEY);
  if (!authData) return false;
  try {
    const parsed = JSON.parse(authData);
    const now = Date.now();
    if (
      now - parsed.timestamp < AUTH_EXPIRY &&
      parsed.password === AUTH_PASSWORD
    ) {
      return true;
    } else {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return false;
  }
}

function showModal() {
  modal.classList.add("show");
  input.value = "";
  errorMsg.textContent = "";
  input.focus();
  document.body.style.overflow = "hidden"; // disable scroll saat modal aktif
}
function hideModal() {
  modal.classList.remove("show");
  document.body.style.overflow = ""; // enable scroll kembali
}

function saveAuth() {
  const data = {
    password: AUTH_PASSWORD,
    timestamp: Date.now(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

function handleSubmit() {
  const val = input.value.trim();
  if (val === "") {
    errorMsg.textContent = "Password tidak boleh kosong.";
    input.focus();
    return;
  }
  if (val === AUTH_PASSWORD) {
    saveAuth();
    hideModal();
  } else {
    errorMsg.textContent = "Password salah. Coba lagi.";
    input.value = "";
    input.focus();
  }
}

// Disable closing modal by clicking outside or pressing Escape
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    // jangan tutup modal saat klik overlay
    e.stopPropagation();
  }
});
window.addEventListener("keydown", (e) => {
  if (
    modal.classList.contains("show") &&
    (e.key === "Escape" || e.key === "Esc")
  ) {
    e.preventDefault();
  }
});

submitBtn.addEventListener("click", handleSubmit);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSubmit();
  }
});

window.addEventListener("load", () => {
  if (!checkAuth()) {
    showModal();
  }
});
