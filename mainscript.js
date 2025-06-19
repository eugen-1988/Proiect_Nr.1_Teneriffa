// =======>>>>         Carousel Swiper         <<<<<========== //

new Swiper(".card-wrapper", {
  loop: true,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// =======>>>>         Scrolled Navbar         <<<<<========== //

const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  // Wenn gescrollt wird:
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// =======>>>>         Theme Switch         <<<<<========== //

const faqLink = document.getElementById("faq-link");
faqLink?.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.toggle("alternate-theme");
  localStorage.setItem(
    "altTheme",
    document.body.classList.contains("alternate-theme")
  );
});
if (localStorage.getItem("altTheme") === "true") {
  document.body.classList.add("alternate-theme");
}

// =======>>>>         Language Switch         <<<<<========== //

document.addEventListener("DOMContentLoaded", () => {
  const languageConfig = {
    en: { name: "English", flag: "English_lang.png" },
    de: { name: "Deutsch", flag: "German_lang.png" },
    es: { name: "Español", flag: "Spanish_lang.png" },
  };

  let currentLang = localStorage.getItem("language") || "en";
  let translations = {};

  const fetchAndApplyTranslations = () => {
    fetch("data.json")
      .then((res) => res.json())
      .then((data) => {
        translations = data;
        applyTranslations();
      })
      .catch((err) => console.error("Translation load error:", err));
  };

  const applyTranslations = () => {
    const langData = translations["home"]?.[currentLang];
    const config = languageConfig[currentLang];
    if (!langData || !config) return;

    document.getElementById("selected-language").textContent = config.name;
    const flagImg = document.getElementById("language-flag");
    flagImg.src = `Img/lang_img/${config.flag}`;
    flagImg.alt = config.name;

    Object.entries(langData).forEach(([key, value]) => {
      const el = document.getElementById(key);
      if (el) el.textContent = value;
    });
  };

  const setupDropdown = () => {
    document.querySelectorAll("#dropdown-content a").forEach((item) => {
      // Für jeden Menüpunkt:
      item.addEventListener("click", (e) => {
        e.preventDefault();
        currentLang = item.getAttribute("data-lang");
        localStorage.setItem("language", currentLang);
        applyTranslations();
        document.getElementById("dropdown-content").classList.remove("show");
      });
    });

    document.getElementById("dropbtn").addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("dropdown-content").classList.toggle("show");
    });

    document.addEventListener("click", () => {
      document.getElementById("dropdown-content").classList.remove("show");
    });
  };

  fetchAndApplyTranslations();
  setupDropdown();

  // ==========>>>>     Auto Update Function (async/await)     <<<<=========== //

  const fetchAndUpdateData = async () => {
    try {
      const res = await fetch("/data.json");
      const updated = await res.json();
      translations = updated;
      applyTranslations();
      console.log("Data updated at", new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error during auto update:", err);
    }
  };

  setInterval(fetchAndUpdateData, 60000);
});
