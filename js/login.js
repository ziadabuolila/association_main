// ----- js form login -----
const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});
loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});
// ---- modal ----
const openBtn = document.getElementById("openModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalBox = document.getElementById("modalBox");
openBtn.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  setTimeout(() => {
    modalBox.classList.add("active");
  }, 50);
});
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalBox.classList.remove("active");
    setTimeout(() => {
      modalOverlay.style.display = "none";
    }, 500);
  }
});
function saveUser() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  const statusDiv = document.getElementById("registerStatus");

  statusDiv.style.display = "none";
  statusDiv.innerText = "";

  if (!username || !email || !password || !confirmPassword) {
    statusDiv.innerText = "من فضلك املأ جميع الحقول";
    statusDiv.className = "login-msg error";
    statusDiv.style.display = "block";
    return;
  }

  if (password.length < 8) {
    statusDiv.innerText = "كلمة المرور يجب أن تكون 8 أحرف أو أكثر";
    statusDiv.className = "login-msg error";
    statusDiv.style.display = "block";
    return;
  }

  if (password !== confirmPassword) {
    statusDiv.innerText = "كلمة المرور غير متطابقة";
    statusDiv.className = "login-msg error";
    statusDiv.style.display = "block";
    return;
  }

  const now = new Date();
  const userData = {
    username,
    email,
    password,
    status: "مفعل",
    createdAt: now.toLocaleString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));

  statusDiv.innerText = "تم تسجيل الحساب بنجاح";
  statusDiv.className = "login-msg success";
  statusDiv.style.display = "block";

  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirmPassword").value = "";
  setTimeout(() => {
    location.reload();
  }, 500);
}
function changePassword(e) {
  e.preventDefault();

  const email = document.getElementById("modalEmail").value.trim();
  const newPassword = document.getElementById("modalNewPassword").value.trim();
  const confirmPassword = document
    .getElementById("modalConfirmPassword")
    .value.trim();
  const message = document.getElementById("modalMessage");

  if (!email || !newPassword || !confirmPassword) {
    message.style.display = "block";
    message.innerText = "من فضلك املأ جميع الحقول";
    return;
  }

  if (newPassword !== confirmPassword) {
    message.style.display = "block";
    message.innerText = "كلمة المرور غير متطابقة";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userIndex = users.findIndex((u) => u.email === email);

  if (userIndex === -1) {
    message.style.display = "block";
    message.innerText = "هذا الحساب غير موجود";
    return;
  }

  users[userIndex].password = newPassword;

  localStorage.setItem("users", JSON.stringify(users));

  message.style.color = "green";
  message.style.display = "block";
  message.innerText = "تم تغيير كلمة المرور بنجاح!";

  setTimeout(() => {
    location.reload();
  }, 800);
}

const LOCK_TIME = 60 * 1000; // مدة الإيقاف المؤقت
const PERM_OVERLAY_TIME = 2 * 60 * 1000; // 2 دقيقة للنهائي

const tempOverlay = document.getElementById("tempLockOverlay");
const permOverlay = document.getElementById("permLockOverlay");
const countdownEl = document.getElementById("countdown");

let timerInterval = null;
let permTimeout = null;

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function startTempCountdown(user, users, index) {
  clearInterval(timerInterval);

  tempOverlay.style.display = "flex";
  permOverlay.style.display = "none";
  document.body.style.overflow = "hidden";

  function tick() {
    const remaining = user.tempBlockedUntil - Date.now();
    if (remaining <= 0) {
      clearInterval(timerInterval);

      user.status = "مفعل";
      user.failedAttempts = 3; // نحتفظ بعدد المحاولات السابقة
      delete user.tempBlockedUntil;

      users[index] = user;
      localStorage.setItem("users", JSON.stringify(users));

      tempOverlay.style.display = "none";
      document.body.style.overflow = "auto";
    } else {
      countdownEl.textContent = formatTime(remaining);
    }
  }

  tick();
  timerInterval = setInterval(tick, 1000);
}

function showPermOverlay() {
  permOverlay.style.display = "flex";
  tempOverlay.style.display = "none";
  document.body.style.overflow = "hidden";

  if (permTimeout) clearTimeout(permTimeout);
  permTimeout = setTimeout(() => {
    permOverlay.style.display = "none";
    document.body.style.overflow = "auto";
  }, PERM_OVERLAY_TIME);
}

function loginUser() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  if (!email) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex((u) => u.email === email);

  if (index === -1) {
    errorUser.style.display = "block";
    return;
  }

  const user = users[index];
  const now = Date.now();

  if (user.status === "موقوف نهائيًا") {
    showPermOverlay();
    return;
  }

  if (
    user.status === "موقوف مؤقتًا" &&
    user.tempBlockedUntil &&
    now < user.tempBlockedUntil
  ) {
    startTempCountdown(user, users, index);
    return;
  }

  if (user.password !== password) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;

    if (user.failedAttempts === 3) {
      user.status = "موقوف مؤقتًا";
      user.tempBlockedUntil = now + LOCK_TIME;
      users[index] = user;
      localStorage.setItem("users", JSON.stringify(users));
      startTempCountdown(user, users, index);
      return;
    }

    if (user.failedAttempts >= 6) {
      user.status = "موقوف نهائيًا";
      users[index] = user;
      localStorage.setItem("users", JSON.stringify(users));
      showPermOverlay();
      return;
    }

    users[index] = user;
    localStorage.setItem("users", JSON.stringify(users));
    errorUser.style.display = "block";
    return;
  }

  // ✅ تسجيل دخول صحيح → تحديث آخر تسجيل دخول
  user.failedAttempts = 0;
  delete user.tempBlockedUntil;
  user.lastLogin = now;

  users[index] = user;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedUser", JSON.stringify(user));

  window.location.href = "../page/index.html";
}

// عند الضغط على Login
document.getElementById("loginBtn").addEventListener("click", loginUser);

// عند تحميل الصفحة لا يظهر شيء تلقائياً
document.addEventListener("DOMContentLoaded", () => {
  tempOverlay.style.display = "none";
  permOverlay.style.display = "none";
  document.body.style.overflow = "auto";
});
