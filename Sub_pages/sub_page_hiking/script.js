// ==========>>>>       Scrolled Navbar        <<<<=========== //

const navbar = document.querySelector(".navbar");

const checkScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
};

window.addEventListener("scroll", checkScroll);

// ==========>>>>           Theme Switch          <<<<=========== //

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

// ==========>>>>     Language Switch (Hiking)    <<<<=========== //

document.addEventListener("DOMContentLoaded", () => {
  const sectionKey = "hiking";

  const languageConfig = {
    en: {
      name: "English",
      flag: "English_lang.png",
      code: "en",
      filterButton: "Filter: Show All",
      sortButton: "Sort Trails Alphabetically",
      filterYes: "Hard Trails",
      filterNo: "Moderate Trails",
      sortDefault: "Default Order",
    },
    de: {
      name: "Deutsch",
      flag: "German_lang.png",
      code: "de",
      filterButton: "Filter: Alle anzeigen",
      sortButton: "Wanderwege alphabetisch sortieren",
      filterYes: "Schwierige Wanderwege",
      filterNo: "Mittelschwere Wanderwege",
      sortDefault: "Standard Reihenfolge",
    },
    es: {
      name: "Español",
      flag: "Spanish_lang.png",
      code: "es",
      filterButton: "Filtro: Mostrar todo",
      sortButton: "Ordenar senderos alfabéticamente",
      filterYes: "Rutas difíciles",
      filterNo: "Rutas moderadas",
      sortDefault: "Orden predeterminado",
    },
  };

  let currentLang = localStorage.getItem("language") || "en";
  let texts = {};
  let isSorted = false;
  let currentFilter = "all";

  const sortButton = document.getElementById("sortButton");
  const filterOptions = document.getElementById("filterOptions");
  const hikingSection = document.querySelector(".beaches-section");
  const allRows = Array.from(
    hikingSection?.querySelectorAll(".beach-row") || []
  );

  const updateButtonLabels = () => {
    const config = languageConfig[currentLang];
    if (!config) return;
    document.getElementById("filterDropdownButton").textContent =
      currentFilter === "yes"
        ? config.filterYes
        : currentFilter === "no"
        ? config.filterNo
        : config.filterButton;

    sortButton.textContent = isSorted ? config.sortDefault : config.sortButton;
  };

  const renderHikes = () => {
    if (!hikingSection) return;
    hikingSection.innerHTML = "";

    const filteredRows = allRows.filter((row) => {
      return currentFilter === "all" || row.dataset.infra === currentFilter;
    });

    if (isSorted) {
      filteredRows.sort((a, b) =>
        a
          .querySelector("h2")
          .textContent.localeCompare(
            b.querySelector("h2").textContent,
            undefined,
            { sensitivity: "base" }
          )
      );
    }

    filteredRows.forEach((row) => hikingSection.appendChild(row));
  };

  const changeLanguage = (langCode, translations, configData) => {
    currentLang = langCode;
    const config = configData[langCode];
    if (
      !translations ||
      !translations[sectionKey] ||
      !translations[sectionKey][langCode] ||
      !config
    ) {
      console.warn("Missing language data for:", langCode);
      return;
    }

    document.getElementById("selected-language").textContent = config.name;
    const flag = document.getElementById("language-flag");
    flag.src = `lang_img/${config.flag}`;
    flag.alt = config.name;

    const sectionData = translations[sectionKey][langCode];
    Object.entries(sectionData).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element) element.textContent = value;
    });

    updateButtonLabels();
    localStorage.setItem("language", langCode);
  };

  const setupLanguageDropdown = (translations, configData) => {
    document.querySelectorAll("#dropdown-content a").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const langCode = item.dataset.lang;
        changeLanguage(langCode, translations, configData);
        document.getElementById("dropdown-content").classList.remove("show");
      });
    });
  };

  fetch("/data.json")
    .then((response) => response.json())
    .then((translations) => {
      texts = translations;
      setupLanguageDropdown(translations, languageConfig);
      renderHikes();
      changeLanguage(currentLang, translations, languageConfig);
    })
    .catch((err) => console.error("Error loading translations:", err));

  document.getElementById("dropbtn").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("dropdown-content").classList.toggle("show");
  });

  document.addEventListener("click", () => {
    document.getElementById("dropdown-content").classList.remove("show");
  });

  filterOptions.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      currentFilter = e.target.dataset.infra;
      renderHikes();
      changeLanguage(currentLang, texts, languageConfig);
    }
  });

  sortButton?.addEventListener("click", () => {
    isSorted = !isSorted;
    updateButtonLabels();
    renderHikes();
  });

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
