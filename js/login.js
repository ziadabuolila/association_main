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

// ---- تسجيل مستخدم جديد ----
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

// ---- تغيير كلمة المرور ----
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

// ---- القفل المؤقت والنهائي ----
const LOCK_TIME = 60 * 1000; // دقيقة للقفل المؤقت
const tempOverlay = document.getElementById("tempLockOverlay");
const permOverlay = document.getElementById("permLockOverlay");
const countdownEl = document.getElementById("countdown");

let timerInterval = null;

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// بدء عد القفل المؤقت
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

// ---- القفل النهائي ----
function showPermOverlay() {
  permOverlay.style.display = "flex";
  tempOverlay.style.display = "none";
  document.body.style.overflow = "hidden";
}

// ---- تسجيل دخول ----
function loginUser() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  if (!email) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex((u) => u.email === email);

  if (index === -1) {
    errorUser.style.display = "block";
    errorUser.innerText = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    return;
  }

  const user = users[index];
  const now = Date.now();

  // حساب غير مفعل
  if (user.status === "غير مفعل") {
    errorStatus.style.display = "block";
    errorStatus.innerText =
      "حسابك غير مفعل، برجاء الاتصال بخدمة العملاء لتفعيل الحساب";
    return;
  }

  // القفل النهائي
  if (user.status === "موقوف نهائيًا") {
    showPermOverlay();
    return;
  }

  // القفل المؤقت
  if (
    user.status === "موقوف مؤقتًا" &&
    user.tempBlockedUntil &&
    now < user.tempBlockedUntil
  ) {
    startTempCountdown(user, users, index);
    return;
  }

  // التحقق من كلمة المرور
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
    errorUser.innerText = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    return;
  }

  // تسجيل دخول صحيح
  user.failedAttempts = 0;
  delete user.tempBlockedUntil;
  user.lastLogin = now;

  users[index] = user;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedUser", JSON.stringify(user));

  window.location.href = "../page/index.html";
}

// عند الضغط على زر Login
document.getElementById("loginBtn").addEventListener("click", loginUser);

// عند تحميل الصفحة → التحقق من حالة القفل بعد الريفرش
document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.forEach((user, index) => {
    if (
      user.status === "موقوف مؤقتًا" &&
      user.tempBlockedUntil &&
      user.tempBlockedUntil > Date.now()
    ) {
      startTempCountdown(user, users, index);
    }
    if (user.status === "موقوف نهائيًا") {
      showPermOverlay();
    }
  });
});
