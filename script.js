// Function to change the language and flag
function changeLanguage(language, flag) {
  // Update the language text
  document.querySelector("#selected-language").textContent = language;

  // Update the flag image next to the language text
  document.querySelector("#language-flag").src = `Img/lang_img/${flag}`;

  // Close the dropdown menu after selection
  document.querySelector(".dropdown-content").classList.remove("show");
}

// Function to toggle dropdown visibility
document.querySelector(".dropbtn").addEventListener("click", function () {
  document.querySelector(".dropdown-content").classList.toggle("show");
});

// =======>>>>    Carousel Swipper
new Swiper(".card-wrapper", {
  loop: true,
  spaceBetween: 30,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Scrolled Navbar
const navbar = document.querySelector(".navbar");
let hasUserScrolled = false;

// Listen for user scroll interaction
function onUserScroll() {
  hasUserScrolled = true;
  checkScroll();
}

function checkScroll() {
  if (hasUserScrolled && window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", onUserScroll);
