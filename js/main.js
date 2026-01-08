// ----- open menu user -----
document.addEventListener("DOMContentLoaded", () => {
  const userCard = document.getElementById("userCard");
  const userMenu = document.getElementById("userMenu");

  userCard.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && !userCard.contains(e.target)) {
      userMenu.classList.remove("active");
    }
  });
});
const logoutBtn = document.getElementById("logoutBtn");
const logoutOverlay = document.getElementById("logoutOverlay");

logoutBtn.addEventListener("click", function (e) {
  e.preventDefault();

  logoutOverlay.classList.add("active");

  document.body.classList.add("no-scroll");

  setTimeout(() => {
    window.location.href = "../login/log_in.html";
  }, 3000);
});
// ----- Menu Overlay -----
const menuToggle = document.getElementById("menuToggleIcon");
const sideMenu = document.getElementById("sideMenu");
const closeBtn = document.getElementById("closeMenuBtn");
const overlay = document.getElementById("overlayMenu");

menuToggle.addEventListener("click", () => {
  sideMenu.classList.add("active");
  overlay.style.display = "block";
});

const closeMenu = () => {
  sideMenu.classList.remove("active");
  overlay.style.display = "none";
};
closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

const menuDropdowns = document.querySelectorAll(".menuDropdown");

menuDropdowns.forEach((drop) => {
  const link = drop.querySelector("a");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    drop.classList.toggle("open");
    menuDropdowns.forEach((other) => {
      if (other !== drop) {
        other.classList.remove("open");
      }
    });
  });
});
// ----- Loader -----
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
  }, 2000);
});
// ---- modal ----
const openBtnMenu = document.getElementById("openModalMenu");
const modalOverlayMenu = document.getElementById("modalOverlayMenu");
const modalBoxMenu = document.getElementById("modalBoxMenu");
openBtnMenu.addEventListener("click", () => {
  modalOverlayMenu.style.display = "flex";
  setTimeout(() => {
    modalBoxMenu.classList.add("active");
  }, 50);
});
modalOverlayMenu.addEventListener("click", (e) => {
  if (e.target === modalOverlayMenu) {
    modalBoxMenu.classList.remove("active");
    setTimeout(() => {
      modalOverlayMenu.style.display = "none";
    }, 500);
  }
});

// ----- Drop Down Header -----
const dropBtns = document.querySelectorAll(".drop-btn");
dropBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const dropMenu = btn.nextElementSibling;
    dropMenu.style.display =
      dropMenu.style.display === "flex" ? "none" : "block";
  });
});
const openBtnMenuProfile = document.getElementById("openModalMenuProfile");
const modalOverlayMenuProfile = document.getElementById(
  "modalOverlayMenuProfile"
);
const modalBoxMenuProfile = document.getElementById("modalBoxMenuProfile");
openBtnMenuProfile.addEventListener("click", () => {
  modalOverlayMenuProfile.style.display = "flex";
  setTimeout(() => {
    modalBoxMenuProfile.classList.add("active");
  }, 50);
});
modalOverlayMenuProfile.addEventListener("click", (e) => {
  if (e.target === modalOverlayMenuProfile) {
    modalBoxMenuProfile.classList.remove("active");
    setTimeout(() => {
      modalOverlayMenuProfile.style.display = "none";
    }, 500);
  }
});