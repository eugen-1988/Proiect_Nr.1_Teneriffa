// ==========>>>> Scrolled Navbar <<<<=========== //

const navbar = document.querySelector(".navbar");
const checkScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
};
window.addEventListener("scroll", checkScroll);

// ==========>>>> Theme Switch <<<<=========== //

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

// ==========>>>> Language Switch + Sorting "wiewpoints" <<<<=========== //

document.addEventListener("DOMContentLoaded", () => {
  const sectionKey = "wiewpoints";

  const languageConfig = {
    en: {
      name: "English",
      flag: "English_lang.png",
      sortButton: "Sort Viewpoints Alphabetically",
      sortDefault: "Default Order",
    },
    de: {
      name: "Deutsch",
      flag: "German_lang.png",
      sortButton: "Aussichtspunkte alphabetisch sortieren",
      sortDefault: "Standard Reihenfolge",
    },
    es: {
      name: "Español",
      flag: "Spanish_lang.png",
      sortButton: "Ordenar miradores alfabéticamente",
      sortDefault: "Orden Predeterminado",
    },
  };

  let currentLang = localStorage.getItem("language") || "en";
  let translations = {};
  let isSorted = false;
  let originalOrder = [];

  const sortButton = document.getElementById("sortButton");
  const sectionElement = document.getElementById("beaches-section");

  const initializeOriginalOrder = () => {
    originalOrder = Array.from(document.querySelectorAll(".beach-row"));
    originalOrder.forEach((row, index) => {
      row.dataset.originalPosition = index;
    });
  };

  const applySectionData = (translationsData, langCode) => {
    const sectionData = translationsData?.[sectionKey]?.[langCode];
    if (!sectionData) {
      console.warn(`No "${sectionKey}" data found for language "${langCode}"`);
      return;
    }

    Object.entries(sectionData).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
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

    applySectionData(translationsData, langCode);
    localStorage.setItem("language", langCode);
    updateButtonLabels();
    if (resetSort) sortSectionItems();
  };

  const updateButtonLabels = () => {
    const config = languageConfig[currentLang];
    if (sortButton) {
      sortButton.textContent = isSorted
        ? config.sortDefault
        : config.sortButton;
    }
  };

  const sortSectionItems = () => {
    const rows = Array.from(document.querySelectorAll(".beach-row"));
    rows.forEach((row) => row.remove());

    const sorted = isSorted
      ? rows.sort((a, b) =>
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

    sorted.forEach((row) => sectionElement?.appendChild(row));
  };

  const setupLanguageDropdown = (translationsData, configData) => {
    document.querySelectorAll("#dropdown-content a").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const langCode = item.getAttribute("data-lang");
        changeLanguage(langCode, translationsData, configData, false);
        document.getElementById("dropdown-content")?.classList.remove("show");
        sortSectionItems();
      });
    });
  };

  fetch("/data.json")
    .then((res) => res.json())
    .then((data) => {
      translations = data;
      initializeOriginalOrder();
      changeLanguage(currentLang, data, languageConfig, false);
      setupLanguageDropdown(data, languageConfig);
      updateButtonLabels();
    })
    .catch((err) => {
      console.error("Failed to load translations:", err);
      alert("There was an error loading the translation data.");
    });

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
    sortSectionItems();
  });

  // ==========>>>> Auto Update Function <<<<=========== //

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
