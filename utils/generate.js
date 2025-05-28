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

function generateQRCode(url) {
  // === QR kecil untuk tampil ke user ===
  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "";
  new QRCode(qrDiv, {
    text: url,
    width: 300,
    height: 300,
    correctLevel: QRCode.CorrectLevel.H,
  });

  // === QR HD untuk download sebagai SVG ===
  const qrSVGDiv = document.getElementById("hiddenQRsvg");
  qrSVGDiv.innerHTML = "";

  const qr = qrcode(0, 'H'); // TypeNumber=auto, ErrorCorrection=High
  qr.addData(url);
  qr.make();

  const svgTag = qr.createSvgTag({
    cellSize: 8,  // Lebih besar ukuran tiap bloknya
    margin: 4
  });

  qrSVGDiv.innerHTML = svgTag;

  // Tampilkan section
  document.getElementById("qrContainer").style.display = "block";
}




function downloadQR() {
  const svg = document.querySelector("#hiddenQRsvg svg");
  if (!svg) {
    alert("QR SVG belum dibuat.");
    return;
  }

  const serializer = new XMLSerializer();
  const svgBlob = new Blob([serializer.serializeToString(svg)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "qrcode_hd.svg";
  link.click();

  URL.revokeObjectURL(url);
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
