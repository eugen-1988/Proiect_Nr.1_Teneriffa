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

// ==========>>>>     Language Switch (Beaches)    <<<<=========== //

document.addEventListener("DOMContentLoaded", () => {
  const sectionKey = "beaches";

  const languageConfig = {
    en: {
      name: "English",
      flag: "English_lang.png",
      code: "en",
      filterButton: "Filter: Show All",
      sortButton: "Sort Beaches Alphabetically",
      filterYes: "Filter: With Infrastructure",
      filterNo: "Filter: Without Infrastructure",
      sortDefault: "Default Order",
    },
    de: {
      name: "Deutsch",
      flag: "German_lang.png",
      code: "de",
      filterButton: "Filter: Alle anzeigen",
      sortButton: "Strände alphabetisch sortieren",
      filterYes: "Mit Infrastruktur",
      filterNo: "Ohne Infrastruktur",
      sortDefault: "Standard Reihenfolge",
    },
    es: {
      name: "Español",
      flag: "Spanish_lang.png",
      code: "es",
      filterButton: "Filtro: Mostrar todo",
      sortButton: "Ordenar playas alfabéticamente",
      filterYes: "Con Infraestructura",
      filterNo: "Sin Infraestructura",
      sortDefault: "Orden Predeterminado",
    },
  };

  let currentLang = localStorage.getItem("language") || "en";
  let translations = {};
  let isSorted = false;
  let currentFilter = "all";

  const sortButton = document.getElementById("sortButton");
  const filterOptions = document.getElementById("filterOptions");
  const beachSection = document.querySelector(".beaches-section");
  const allRows = Array.from(
    beachSection?.querySelectorAll(".beach-row") || []
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

  const renderBeaches = () => {
    if (!beachSection) return;

    beachSection.innerHTML = "";

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

    filteredRows.forEach((row) => beachSection.appendChild(row));
  };

  const changeLanguage = (langCode, data, configData) => {
    currentLang = langCode;
    const sectionData = data[sectionKey]?.[langCode];
    const config = configData[langCode];
    if (!sectionData || !config) {
      console.warn("Missing data for language:", langCode);
      return;
    }

    document.getElementById("selected-language").textContent = config.name;
    const flag = document.getElementById("language-flag");
    flag.src = `lang_img/${config.flag}`;
    flag.alt = config.name;

    Object.entries(sectionData).forEach(([key, value]) => {
      const el = document.getElementById(key);
      if (el) el.textContent = value;
    });

    updateButtonLabels();
    localStorage.setItem("language", langCode);
  };

  const setupLanguageDropdown = (data, configData) => {
    document.querySelectorAll("#dropdown-content a").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const langCode = item.dataset.lang;
        changeLanguage(langCode, data, configData);
        document.getElementById("dropdown-content").classList.remove("show");
      });
    });
  };

  fetch("/data.json")
    .then((res) => res.json())
    .then((data) => {
      translations = data;
      setupLanguageDropdown(data, languageConfig);
      renderBeaches();
      changeLanguage(currentLang, data, languageConfig);
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
      renderBeaches();
      changeLanguage(currentLang, translations, languageConfig);
    }
  });

  sortButton?.addEventListener("click", () => {
    isSorted = !isSorted;
    updateButtonLabels();
    renderBeaches();
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
