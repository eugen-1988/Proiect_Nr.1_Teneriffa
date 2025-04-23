// ==========>>>>              Carousel Swipper            <<<<=========== //

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

// ==========>>>>              Carousel Swipper            <<<<=========== //

// ==========>>>>              Scrolled Navbar           <<<<=========== //

const navbar = document.querySelector(".navbar");
let hasUserScrolled = false;
let texts;
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

// ==========>>>>              Scrolled Navbar           <<<<=========== //

// ==========>>>>             ThemeSwitch         <<<<=========== //

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

// ==========>>>>             ThemeSwitch         <<<<=========== //

// ==========>>>>             Sprache wechseln          <<<<=========== //
document.addEventListener("DOMContentLoaded", function () {
  // Language configuration with button texts
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
  let texts = {};
  let isSorted = false;
  let currentFilter = "all";

  // Load translations
  fetch("data.json")
    .then((response) => response.json())
    .then((translations) => {
      texts = translations;
      changeLanguage(currentLang, translations, languageConfig);
      setupLanguageDropdown(translations, languageConfig);
    })
    .catch((error) => console.error("Error loading translations:", error));

  // Dropdown toggle
  document.getElementById("dropbtn").addEventListener("click", function (e) {
    e.stopPropagation();
    document.getElementById("dropdown-content").classList.toggle("show");
  });

  document.addEventListener("click", function () {
    document.getElementById("dropdown-content").classList.remove("show");
  });

  function changeLanguage(langCode, translations, configData) {
    currentLang = langCode;
    const langData = translations[langCode];
    const config = configData[langCode];

    if (!langData || !config) return;

    // Update language selection
    document.getElementById("selected-language").textContent = config.name;
    const flag = document.getElementById("language-flag");
    flag.src = `sub_page/lang_img/${config.flag}`;
    flag.alt = config.name;

    // Update content from JSON
    for (const [key, value] of Object.entries(langData)) {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = value;
      }
    }

    // Update button text
    updateButtonLabels();

    // Save language
    localStorage.setItem("language", langCode);
  }

  function setupLanguageDropdown(translations, configData) {
    document.querySelectorAll("#dropdown-content a").forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        const langCode = this.getAttribute("data-lang");
        changeLanguage(langCode, translations, configData);
        document.getElementById("dropdown-content").classList.remove("show");
      });
    });
  }

  function updateButtonLabels() {
    const config = languageConfig[currentLang];
    document.getElementById("filterDropdownButton").textContent =
      config.filterButton;
    document.getElementById("sortButton").textContent = isSorted
      ? config.sortDefault
      : config.sortButton;
  }

  // Beach Section logic
  const sortButton = document.getElementById("sortButton");
  const filterOptions = document.getElementById("filterOptions");
  const beachSection = document.querySelector(".beaches-section");
  const allRows = Array.from(beachSection.querySelectorAll(".beach-row"));

  function renderBeaches() {
    beachSection.innerHTML = "";

    let rowsToDisplay = allRows.filter((row) => {
      if (currentFilter === "yes") return row.dataset.infra === "yes";
      if (currentFilter === "no") return row.dataset.infra === "no";
      return true;
    });

    if (isSorted) {
      rowsToDisplay.sort((a, b) => {
        const titleA = a.querySelector("h2").textContent.trim().toLowerCase();
        const titleB = b.querySelector("h2").textContent.trim().toLowerCase();
        return titleA.localeCompare(titleB);
      });
    }

    rowsToDisplay.forEach((row) => beachSection.appendChild(row));
  }

  // Filter dropdown logic
  filterOptions.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      event.preventDefault();
      currentFilter = event.target.dataset.infra;

      const config = languageConfig[currentLang];
      const filterButton = document.getElementById("filterDropdownButton");

      if (currentFilter === "yes") {
        filterButton.textContent = config.filterYes;
      } else if (currentFilter === "no") {
        filterButton.textContent = config.filterNo;
      } else {
        filterButton.textContent = config.filterButton;
      }

      renderBeaches();
    }
  });

  // Sort button logic
  sortButton.addEventListener("click", () => {
    isSorted = !isSorted;
    updateButtonLabels(); // Use selected language
    renderBeaches();
  });

  renderBeaches(); // Initial load
});
//  ==================      Sort-Filter-Button   ====================  //

// ==========>>>> Auto-Update Beach Data <<<<=========== //

// Function to fetch updated beach data
async function fetchUpdatedBeachData() {
  try {
    const response = await fetch("beach-data.json"); // Replace with your actual endpoint
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching updated beach data:", error);
    return null;
  }
}

// Function to update the DOM with new data
function updateBeachData(newData) {
  if (!newData) return;

  const beachSection = document.querySelector(".beaches-section");
  const template = document.querySelector(".beach-row-template"); // You'll need a template

  // Clear current data
  beachSection.innerHTML = "";

  // Add new data
  newData.forEach((beach) => {
    const clone = template.content.cloneNode(true);
    // Update clone with beach data
    clone.querySelector("h2").textContent = beach.name;
    clone.querySelector(".location").textContent = beach.location;
    clone.querySelector(".description").textContent = beach.description;
    clone.dataset.infra = beach.hasInfrastructure ? "yes" : "no";

    beachSection.appendChild(clone);
  });

  // Reinitialize any event listeners if needed
  initializeBeachRowEvents();
}

// Auto-update logic
let updateInterval;
let isAutoUpdating = false;

function startAutoUpdate() {
  if (isAutoUpdating) return;

  isAutoUpdating = true;
  updateInterval = setInterval(async () => {
    console.log("Updating beach data...");
    const newData = await fetchUpdatedBeachData();
    updateBeachData(newData);
  }, 5000); // 5 seconds
}

function stopAutoUpdate() {
  isAutoUpdating = false;
  clearInterval(updateInterval);
}

// Toggle button for auto-update
document.addEventListener("DOMContentLoaded", () => {
  const autoUpdateButton = document.createElement("button");
  autoUpdateButton.id = "autoUpdateButton";
  autoUpdateButton.textContent = "Enable Auto-Update";
  autoUpdateButton.classList.add("auto-update-btn");

  // Add button to the page (you might want to position it appropriately)
  document
    .querySelector(".filter-sort-container")
    .appendChild(autoUpdateButton);

  autoUpdateButton.addEventListener("click", () => {
    if (isAutoUpdating) {
      stopAutoUpdate();
      autoUpdateButton.textContent = "Enable Auto-Update";
    } else {
      startAutoUpdate();
      autoUpdateButton.textContent = "Disable Auto-Update";
    }
  });
});

// ==========>>>> Auto-Update Beach Data <<<<=========== //
