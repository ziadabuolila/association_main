// ----- Loader -----
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
  }, 2000);
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
// ----- Slider Img Home -----
const items = document.querySelectorAll(".carousel-item");
const indicators = document.querySelectorAll(".carousel-indicators span");
let current = 0;

function showSlide(index) {
  items.forEach((i) => i.classList.remove("active"));
  indicators.forEach((i) => i.classList.remove("active"));

  items[index].classList.add("active");
  indicators[index].classList.add("active");

  current = index;
}

document.querySelector(".next").onclick = () => {
  let idx = (current + 1) % items.length;
  showSlide(idx);
};

document.querySelector(".prev").onclick = () => {
  let idx = (current - 1 + items.length) % items.length;
  showSlide(idx);
};

indicators.forEach((ind) => {
  ind.addEventListener("click", () => {
    showSlide(+ind.getAttribute("data-slide"));
  });
});

setInterval(() => {
  let idx = (current + 1) % items.length;
  showSlide(idx);
}, 5000);
// ----- About img show-hide ( 5 ) -----
