// Function to change the language and flag

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
// =======>>>>    Carousel Swipper
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

// Sprache wechseln =====================================================
document.addEventListener("DOMContentLoaded", function () {
  // Language configuration
  const languageConfig = {
    en: {
      name: "English",
      flag: "English_lang.png",
      code: "en",
    },
    de: {
      name: "Deutsch",
      flag: "German_lang.png",
      code: "de",
    },
    es: {
      name: "Español",
      flag: "Spanish_lang.png",
      code: "es",
    },
  };

  // Load translations
  fetch("data.json")
    .then((response) => response.json())
    .then((translations) => {
      // Initialize with saved language or default to English
      const savedLang = localStorage.getItem("language") || "en";
      changeLanguage(savedLang, translations, languageConfig);

      // Setup dropdown event listeners
      setupLanguageDropdown(translations, languageConfig);
    })
    .catch((error) => console.error("Error loading translations:", error));

  // Toggle dropdown
  document.getElementById("dropbtn").addEventListener("click", function (e) {
    e.stopPropagation();
    document.getElementById("dropdown-content").classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function () {
    document.getElementById("dropdown-content").classList.remove("show");
  });
});

function changeLanguage(langCode, translations, languageConfig) {
  const langData = translations[langCode];
  const config = languageConfig[langCode];

  if (!langData || !config) return;

  // Update button text and flag
  document.getElementById("selected-language").textContent = config.name;
  document.getElementById("language-flag").src = `Img/lang_img/${config.flag}`;
  document.getElementById("language-flag").alt = config.name;

  // Update all translatable elements
  for (const [key, value] of Object.entries(langData)) {
    const element = document.getElementById(key);
    if (element) {
      element.textContent = value;
    }
  }

  // Save preference
  localStorage.setItem("language", langCode);
}

function setupLanguageDropdown(translations, languageConfig) {
  document.querySelectorAll("#dropdown-content a").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const langCode = this.getAttribute("data-lang");
      changeLanguage(langCode, translations, languageConfig);
      document.getElementById("dropdown-content").classList.remove("show");
    });
  });
}

// Sprache wechseln ======================================== /////////////

// \themeSwitch ======================================== ///////////////
document.getElementById("faq-link").addEventListener("click", function (e) {
  e.preventDefault();

  // Toggle theme class on body
  document.body.classList.toggle("alternate-theme");

  // Optional: Save preference (remove if not needed)
  localStorage.setItem(
    "altTheme",
    document.body.classList.contains("alternate-theme")
  );
});

// Optional: Load saved preference
if (localStorage.getItem("altTheme") === "true") {
  document.body.classList.add("alternate-theme");
}
// \themeSwitch ======================================== /////////////
