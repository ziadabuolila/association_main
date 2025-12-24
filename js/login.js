// ----- js loader login -----
window.addEventListener("load", function () {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.classList.add("hide");
    setTimeout(() => {
      loader.style.display = "none";
    }, 800);
  }, 2000);
});
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
  }, 2000);
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
function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const errorUser = document.getElementById("errorUser");
  const errorStatus = document.getElementById("errorStatus");

  errorUser.style.display = "none";
  errorStatus.style.display = "none";

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userIndex = users.findIndex(
    (u) => u.email === email && u.password === password
  );

  if (userIndex === -1) {
    errorUser.style.display = "block";
    return;
  }

  const user = users[userIndex];

  if (user.status !== "مفعل") {
    errorStatus.style.display = "block";
    return;
  }

  // تحديث آخر تسجيل دخول
  const now = new Date();
  const formattedDate = `${now.getDate()} - ${
    now.getMonth() + 1
  } - ${now.getFullYear()} / ${now.getHours()}:${now.getMinutes()} / ${now.toLocaleDateString(
    "ar-EG",
    {
      weekday: "long",
    }
  )}`;
  user.lastLogin = formattedDate;

  // إذا الخاصية غير موجودة، نفعلها تلقائيًا
  if (user.twoFactorEnabled === undefined) {
    user.twoFactorEnabled = true; // أو false حسب ما تحب
  }

  // تحديث المستخدم في قائمة users
  users[userIndex] = user;
  localStorage.setItem("users", JSON.stringify(users));

  // حفظ المستخدم المسجل
  localStorage.setItem("loggedUser", JSON.stringify(user));

  window.location.href = "../page/index.html";
}

const modalOverlayMenu = document.getElementById("modalOverlayMenu");
const modalBoxMenu = document.getElementById("modalBoxMenu");
const modalForm = modalBoxMenu.querySelector(".modal-password-change-form");

modalForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const emailInput = modalForm.querySelector('input[type="email"]');
  const passwordInput = modalForm.querySelector(
    'input[placeholder="كلمة المرور"]'
  );
  const confirmInput = modalForm.querySelector(
    'input[placeholder="تأكيد كلمة المرور"]'
  );

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmInput.value.trim();

  const statusMsg = modalForm.querySelector(".status-msg");
  const icon = statusMsg.querySelector(".icon");
  const msgText = statusMsg.querySelector(".msg-text");

  // التحقق من طول كلمة المرور
  if (password.length < 8) {
    icon.innerText = "❌";
    msgText.innerText = "كلمة المرور يجب أن تكون 8 أحرف أو أكثر";
    statusMsg.className = "status-msg error";
    statusMsg.style.display = "flex";
    return;
  }

  // التحقق من تطابق كلمة المرور والتأكيد
  if (password !== confirmPassword) {
    icon.innerText = "❌";
    msgText.innerText = "كلمة المرور غير متطابقة";
    statusMsg.className = "status-msg error";
    statusMsg.style.display = "flex";
    return;
  }

  // جلب المستخدمين من localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.email === email);

  if (userIndex === -1) {
    icon.innerText = "❌";
    msgText.innerText = "الإيميل خاطئ";
    statusMsg.className = "status-msg error";
    statusMsg.style.display = "flex";
    return;
  }

  // تحديث الباسورد في localStorage
  users[userIndex].password = password;
  localStorage.setItem("users", JSON.stringify(users));

  // تحديث الباسورد في الجدول مباشرة
  const tableBody = document.getElementById("tableBody");
  const row = tableBody.children[userIndex];
  if (row) {
    const passwordCell = row.querySelectorAll("td")[3];
    const passwordSpan = passwordCell.querySelector(".text");
    const passwordInputCell = passwordCell.querySelector(".edit-input");

    passwordSpan.innerText = "*".repeat(password.length);
    passwordInputCell.value = password;
  }

  // رسالة نجاح
  icon.innerText = "✅";
  msgText.innerText = "تم تحديث كلمة المرور بنجاح";
  statusMsg.className = "status-msg success";
  statusMsg.style.display = "flex";

  setTimeout(() => {
    // إخفاء المودال
    modalOverlayMenu.classList.add("hide");

    // تنظيف الحقول
    emailInput.value = "";
    passwordInput.value = "";
    confirmInput.value = "";

    // ريفرش بعد ما المودال يختفي
    setTimeout(() => {
      location.reload();
    }, 300);
  }, 1200);
});
