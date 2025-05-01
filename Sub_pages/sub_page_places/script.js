// ==========>>>>              Scrolled Navbar           <<<<=========== //

const navbar = document.querySelector(".navbar");
const checkScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
};
window.addEventListener("scroll", checkScroll);

// ==========>>>>         Theme Switch        <<<<=========== //

document.getElementById("faq-link")?.addEventListener("click", (e) => {
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

// ==========>>>>        Sprache wechseln       <<<<=========== //

document.addEventListener("DOMContentLoaded", () => {
  const sectionKey = "places";

  const languageConfig = {
    en: {
      name: "English",
      flag: "English_lang.png",
      sortButton: "Sort Places Alphabetically",
      sortDefault: "Default Order",
    },
    de: {
      name: "Deutsch",
      flag: "German_lang.png",
      sortButton: "Orte alphabetisch sortieren",
      sortDefault: "Standard Reihenfolge",
    },
    es: {
      name: "Español",
      flag: "Spanish_lang.png",
      sortButton: "Ordenar lugares alfabéticamente",
      sortDefault: "Orden Predeterminado",
    },
  };

  let currentLang = localStorage.getItem("language") || "en";
  let translations = {};
  let isSorted = false;
  let originalOrder = [];

  const sortButton = document.getElementById("sortButton");
  const beachSection = document.getElementById("beaches-section");

  const initializeOriginalOrder = () => {
    originalOrder = Array.from(document.querySelectorAll(".beach-row"));
    originalOrder.forEach((row, index) => {
      row.dataset.originalPosition = index;
    });
  };

  const applyPlacesData = (translationsData, langCode) => {
    const sectionData = translationsData?.[sectionKey]?.[langCode];
    if (!sectionData) {
      console.warn(`No "${sectionKey}" data found for language "${langCode}"`);
      return;
    }

    Object.entries(sectionData).forEach(([key, value]) => {
      const el = document.getElementById(key);
      if (el) el.textContent = value;
    });
  };

  const changeLanguage = (
    langCode,
    translationsData,
    configData,
    resetSort = true
  ) => {
    const config = configData[langCode];
    if (!config) {
      console.error(`Language config not found for "${langCode}"`);
      return;
    }

    currentLang = langCode;

    const selectedLanguageEl = document.getElementById("selected-language");
    if (selectedLanguageEl) selectedLanguageEl.textContent = config.name;

    const flag = document.getElementById("language-flag");
    if (flag) {
      flag.src = `lang_img/${config.flag}`;
      flag.alt = config.name;
    }

    applyPlacesData(translationsData, langCode);

    localStorage.setItem("language", langCode);
    updateButtonLabels();
    if (resetSort) sortBeaches();
  };

  const updateButtonLabels = () => {
    const config = languageConfig[currentLang];
    if (sortButton) {
      sortButton.textContent = isSorted
        ? config.sortDefault
        : config.sortButton;
    }
  };

  const sortBeaches = () => {
    const beachRows = Array.from(document.querySelectorAll(".beach-row"));
    beachRows.forEach((row) => row.remove());

    const sorted = isSorted
      ? beachRows.sort((a, b) =>
          a
            .querySelector("h2")
            .textContent.trim()
            .localeCompare(
              b.querySelector("h2").textContent.trim(),
              undefined,
              { sensitivity: "base" }
            )
        )
      : originalOrder;

    sorted.forEach((row) => beachSection?.appendChild(row));
  };

  const setupLanguageDropdown = (translationsData, configData) => {
    document.querySelectorAll("#dropdown-content a").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const langCode = item.getAttribute("data-lang");
        changeLanguage(langCode, translationsData, configData, false);
        document.getElementById("dropdown-content").classList.remove("show");
        sortBeaches();
      });
    });
  };

  fetch("/data.json")
    .then((res) => res.json())
    .then((initialTranslations) => {
      translations = initialTranslations;
      initializeOriginalOrder();
      changeLanguage(currentLang, translations, languageConfig, false);
      setupLanguageDropdown(translations, languageConfig);
      updateButtonLabels();
    })
    .catch((err) => {
      console.error("Failed to load translations:", err);
      alert("There was an error loading the translation data.");
    });

  // Dropdown interactions
  document.getElementById("dropbtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("dropdown-content")?.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    document.getElementById("dropdown-content")?.classList.remove("show");
  });

  sortButton?.addEventListener("click", () => {
    isSorted = !isSorted;
    updateButtonLabels();
    sortBeaches();
  });

  // ==========>>>>     Auto Update Function (async/await)     <<<<=========== //

  const fetchAndUpdateData = async () => {
    try {
      const res = await fetch("/data.json");
      const updated = await res.json();
      translations = updated;
      changeLanguage(currentLang, updated, languageConfig);
      console.log("Data updated at", new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error during auto update:", err);
    }
  };

  setInterval(fetchAndUpdateData, 60000);
});
