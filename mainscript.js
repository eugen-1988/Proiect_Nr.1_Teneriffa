// =======>>>>         Carousel Swiper         <<<<<========== //

new Swiper(".card-wrapper", {
  // Initialisiert einen neuen Swiper auf dem Element mit der Klasse "card-wrapper"
  loop: true, // Aktiviert unendliche Schleife – der Slider wiederholt sich
  spaceBetween: 30, // Setzt 30 Pixel Abstand zwischen den Slides
  pagination: {
    el: ".swiper-pagination", // Verwendet das Element mit der Klasse "swiper-pagination" für die Punkte
    clickable: true, // Macht die Punkte anklickbar
    dynamicBullets: true, // Aktiviert dynamische Anzeige der Punkte (größerer Punkt für aktive Slide)
  },
  navigation: {
    nextEl: ".swiper-button-next", // Button für nächste Slide
    prevEl: ".swiper-button-prev", // Button für vorherige Slide
  },
  breakpoints: {
    0: { slidesPerView: 1 }, // Auf kleinen Bildschirmen 1 Slide anzeigen
    768: { slidesPerView: 2 }, // Ab 768px Breite 2 Slides anzeigen
    1024: { slidesPerView: 3 }, // Ab 1024px Breite 3 Slides anzeigen
  },
});

// =======>>>>         Scrolled Navbar         <<<<<========== //

const navbar = document.querySelector(".navbar"); // Holt das Element mit der Klasse "navbar"
window.addEventListener("scroll", () => {
  // Wenn gescrollt wird:
  navbar.classList.toggle("scrolled", window.scrollY > 50); // Fügt Klasse "scrolled" hinzu, wenn Scrollposition über 50px ist
});

// =======>>>>         Theme Switch         <<<<<========== //

const faqLink = document.getElementById("faq-link"); // Holt das Element mit der ID "faq-link"
faqLink?.addEventListener("click", (e) => {
  // Falls vorhanden: Beim Klick wird
  e.preventDefault(); // Der Standard-Link-Verhalten verhindert
  document.body.classList.toggle("alternate-theme"); // Wechselt die Klasse "alternate-theme" auf dem <body>
  localStorage.setItem(
    // Speichert den aktuellen Zustand im lokalen Speicher
    "altTheme",
    document.body.classList.contains("alternate-theme") // true oder false, je nach ob Klasse aktiv ist
  );
});
if (localStorage.getItem("altTheme") === "true") {
  // Wenn beim Laden die Einstellung true ist:
  document.body.classList.add("alternate-theme"); // Fügt die Theme-Klasse dem Body hinzu
}

// =======>>>>         Language Switch         <<<<<========== //

document.addEventListener("DOMContentLoaded", () => {
  // Führt den Code aus, wenn DOM vollständig geladen ist
  const languageConfig = {
    // Definiert Sprachen mit Namen und Flaggenbildern
    en: { name: "English", flag: "English_lang.png" },
    de: { name: "Deutsch", flag: "German_lang.png" },
    es: { name: "Español", flag: "Spanish_lang.png" },
  };

  let currentLang = localStorage.getItem("language") || "en"; // Holt gespeicherte Sprache oder setzt Standard "en"
  let translations = {}; // Leeres Objekt für spätere Übersetzungen

  const fetchAndApplyTranslations = () => {
    // Holt Übersetzungen und wendet sie an
    fetch("data.json") // Lädt JSON-Datei mit Übersetzungen
      .then((res) => res.json()) // Wandelt Antwort in JSON um
      .then((data) => {
        translations = data; // Speichert Daten im Objekt
        applyTranslations(); // Ruft Funktion auf, um Inhalte zu ersetzen
      })
      .catch((err) => console.error("Translation load error:", err)); // Gibt Fehler aus, falls Laden fehlschlägt
  };

  const applyTranslations = () => {
    // Wendet Sprachdaten an
    const langData = translations["home"]?.[currentLang]; // Holt Daten für aktuellen Bereich (home) und Sprache
    const config = languageConfig[currentLang]; // Holt Konfiguration der aktuellen Sprache
    if (!langData || !config) return; // Falls keine Daten vorhanden, abbrechen

    document.getElementById("selected-language").textContent = config.name; // Setzt Sprachname im UI
    const flagImg = document.getElementById("language-flag"); // Holt Flaggenbild-Element
    flagImg.src = `Img/lang_img/${config.flag}`; // Setzt Bildquelle entsprechend der Sprache
    flagImg.alt = config.name; // Setzt Alternativtext (Barrierefreiheit)

    Object.entries(langData).forEach(([key, value]) => {
      // Geht alle Übersetzungen durch
      const el = document.getElementById(key); // Holt Element mit passender ID
      if (el) el.textContent = value; // Ersetzt Text, falls Element existiert
    });
  };

  const setupDropdown = () => {
    // Funktion für Sprachmenü (Dropdown)
    document.querySelectorAll("#dropdown-content a").forEach((item) => {
      // Für jeden Menüpunkt:
      item.addEventListener("click", (e) => {
        e.preventDefault(); // Verhindert Seitenwechsel
        currentLang = item.getAttribute("data-lang"); // Holt Sprachcode
        localStorage.setItem("language", currentLang); // Speichert neue Sprache
        applyTranslations(); // Wendet die Sprache an
        document.getElementById("dropdown-content").classList.remove("show"); // Schließt Menü
      });
    });

    document.getElementById("dropbtn").addEventListener("click", (e) => {
      e.stopPropagation(); // Verhindert, dass Klick andere Events auslöst
      document.getElementById("dropdown-content").classList.toggle("show"); // Zeigt oder versteckt Menü
    });

    document.addEventListener("click", () => {
      document.getElementById("dropdown-content").classList.remove("show"); // Klick außerhalb schließt Menü
    });
  };

  fetchAndApplyTranslations(); // Lädt Übersetzungen beim Start
  setupDropdown(); // Initialisiert Dropdown-Menü

  // ==========>>>>     Auto Update Function (async/await)     <<<<=========== //

  const fetchAndUpdateData = async () => {
    // Asynchrone Funktion zur automatischen Datenaktualisierung
    try {
      const res = await fetch("/data.json"); // Holt aktuelle Daten
      const updated = await res.json(); // Wandelt Antwort in JSON
      translations = updated; // Speichert neue Daten
      applyTranslations(); // Wendet die aktualisierten Daten an
      console.log("Data updated at", new Date().toLocaleTimeString()); // Ausgabe mit Uhrzeit
    } catch (err) {
      console.error("Error during auto update:", err); // Fehlerausgabe bei Problemen
    }
  };

  setInterval(fetchAndUpdateData, 60000); // Führt alle 60 Sekunden automatische Aktualisierung aus
});
