// ==========>>>>       Scrolled Navbar        <<<<=========== //

const navbar = document.querySelector(".navbar"); // Holt das Element mit der Klasse "navbar"

const checkScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50); // Fügt Klasse "scrolled" hinzu, wenn Scrollposition > 50px ist
};

window.addEventListener("scroll", checkScroll); // Führt checkScroll aus, wenn Benutzer scrollt

// ==========>>>>           Theme Switch          <<<<=========== //

const faqLink = document.getElementById("faq-link"); // Holt das Element mit der ID "faq-link"

faqLink?.addEventListener("click", (e) => {
  // Wenn Element vorhanden, reagiere auf Klick
  e.preventDefault(); // Verhindert Standardverhalten (z. B. Seitenwechsel)
  document.body.classList.toggle("alternate-theme"); // Wechselt das Theme durch Hinzufügen/Entfernen der Klasse
  localStorage.setItem(
    // Speichert das aktuelle Theme im lokalen Speicher
    "altTheme",
    document.body.classList.contains("alternate-theme") // true, wenn Klasse aktiv ist
  );
});

if (localStorage.getItem("altTheme") === "true") {
  // Wenn vorher gespeichertes Theme aktiv war:
  document.body.classList.add("alternate-theme"); // Setzt Theme beim Laden automatisch
}

// ==========>>>>     Language Switch (Beaches)    <<<<=========== //

document.addEventListener("DOMContentLoaded", () => {
  // ➤ Führt den gesamten Code erst aus, wenn das HTML-Dokument vollständig geladen ist

  const sectionKey = "beaches"; // Setzt Bereichsschlüssel für Übersetzungsdaten

  const languageConfig = {
    // Definition der Sprachkonfiguration
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

  let currentLang = localStorage.getItem("language") || "en"; // Aktuelle Sprache aus dem Speicher oder Standard "en"
  let translations = {}; // Objekt für Übersetzungen
  let isSorted = false; // Gibt an, ob sortiert wurde
  let currentFilter = "all"; // Aktueller Filterstatus (alle, mit, ohne)

  const sortButton = document.getElementById("sortButton"); // ➤ Holt das Sortier-Button-Element
  const filterOptions = document.getElementById("filterOptions"); // ➤ Holt das Filtermenü
  const beachSection = document.querySelector(".beaches-section"); // ➤ Greift auf den Abschnitt zu, der alle Strand-Einträge enthält
  const allRows = Array.from(
    // ➤ Wandelt alle Strand-Zeilen in ein Array um, um später mit ihnen zu arbeiten
    beachSection?.querySelectorAll(".beach-row") || []
  );

  const updateButtonLabels = () => {
    // Aktualisiert Text auf den Buttons basierend auf Sprache und Status
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
    // ➤ Zeigt die Strände entsprechend der aktuellen Filter- und Sortiereinstellungen an
    if (!beachSection) return;

    beachSection.innerHTML = ""; // Löscht aktuellen Inhalt

    const filteredRows = allRows.filter((row) => {
      return currentFilter === "all" || row.dataset.infra === currentFilter; // Filtert nach Infrastruktur
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
      ); // Sortiert alphabetisch nach Titel
    }

    filteredRows.forEach((row) => beachSection.appendChild(row)); // ➤ Fügt die gefilterten und ggf. sortierten Strände wieder in den DOM ein
  };

  const changeLanguage = (langCode, data, configData) => {
    // ➤ Ändert die aktuelle Sprache und aktualisiert die Webseite
    currentLang = langCode;
    const sectionData = data[sectionKey]?.[langCode];
    const config = configData[langCode];
    if (!sectionData || !config) {
      console.warn("Missing data for language:", langCode); // Warnung bei fehlender Sprache
      return;
    }

    document.getElementById("selected-language").textContent = config.name; // Aktualisiert Sprache im UI
    const flag = document.getElementById("language-flag"); // Holt Flaggenbild
    flag.src = `lang_img/${config.flag}`; // Setzt Quelle
    flag.alt = config.name; // Alt-Text für Barrierefreiheit

    Object.entries(sectionData).forEach(([key, value]) => {
      const el = document.getElementById(key);
      if (el) el.textContent = value; // Setzt Text in übersetzten Elementen
    });

    updateButtonLabels(); // Aktualisiert Buttons mit korrekten Sprachwerten
    localStorage.setItem("language", langCode); // Speichert Sprache lokal
  };

  const setupLanguageDropdown = (data, configData) => {
    // ➤ Setzt die Klick-Funktionalität für das Sprachmenü
    document.querySelectorAll("#dropdown-content a").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const langCode = item.dataset.lang;
        changeLanguage(langCode, data, configData); // Sprache ändern
        document.getElementById("dropdown-content").classList.remove("show"); // Menü schließen
      });
    });
  };

  fetch("/data.json") // Holt Übersetzungsdaten
    .then((res) => res.json())
    .then((data) => {
      translations = data;
      setupLanguageDropdown(data, languageConfig); // Menü vorbereiten
      renderBeaches(); // Strände anzeigen
      changeLanguage(currentLang, data, languageConfig); // Sprache beim Start anwenden
    })
    .catch((err) => console.error("Error loading translations:", err)); // Fehlerbehandlung

  document.getElementById("dropbtn").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("dropdown-content").classList.toggle("show"); // Menü ein-/ausblenden
  });

  document.addEventListener("click", () => {
    document.getElementById("dropdown-content").classList.remove("show"); // Klick außerhalb schließt das Menü
  });

  filterOptions.addEventListener("click", (e) => {
    // Reaktion auf Filterauswahl
    if (e.target.tagName === "A") {
      e.preventDefault();
      currentFilter = e.target.dataset.infra; // Filterwert übernehmen
      renderBeaches(); // Ansicht aktualisieren
      changeLanguage(currentLang, translations, languageConfig); // Sprache beibehalten
    }
  });

  sortButton?.addEventListener("click", () => {
    // Klick auf Sortierknopf
    isSorted = !isSorted; // Sortierung umschalten
    updateButtonLabels(); // Buttons aktualisieren
    renderBeaches(); // Ansicht neu aufbauen
  });

  // Optional: auto-refresh data every 60s
  const fetchAndUpdateData = async () => {
    // Asynchrone Funktion zum Daten-Update
    try {
      const res = await fetch("/data.json"); // Neue Daten laden
      const updated = await res.json();
      translations = updated;
      changeLanguage(currentLang, updated, languageConfig); // Neue Daten anwenden
      console.log("Data updated at", new Date().toLocaleTimeString()); // Log mit Uhrzeit
    } catch (err) {
      console.error("Error during auto update:", err); // Fehler bei Update
    }
  };

  setInterval(fetchAndUpdateData, 60000); // Alle 60 Sekunden automatische Aktualisierung
});
