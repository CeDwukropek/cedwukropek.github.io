# 🎨 Filament Explorer

**Filament Explorer** to aplikacja webowa stworzona w **React**, która umożliwia szybkie wyszukiwanie i filtrowanie filamentów do druku 3D.  
Projekt powstał jako narzędzie **do własnego użytku**, aby w jednym miejscu zebrać informacje o posiadanych filamentach i łatwo je przeszukiwać wg koloru, marki, materiału czy specjalnych właściwości.


## ✨ Funkcjonalności

- 🔎 **Wyszukiwanie** po nazwie filamentu (dynamiczne, bez przeładowania strony).
- 🏷️ **Filtrowanie po tagach**, z automatycznym grupowaniem:
  - Material
  - Brand
  - Color
  - Type
  - Features
- ✅ **Zarządzanie filtrami**:
  - Zaznaczanie/odznaczanie pojedynczych tagów
  - **Toggle: "Zaznacz wszystkie / Wyczyść grupę"** dla każdej kategorii
  - **Globalny przycisk "Wyczyść wszystkie filtry"**
- 📊 **Łączenie filtrów** – możesz wybrać np. tylko _PLA_ + _Anycubic_ + _Czerwony_ i zobaczysz wszystkie spełniające kryteria filamenty.
- 📱 **Responsywny interfejs** – wygodny także na urządzeniach mobilnych.


## 🚀 Jak uruchomić projekt

1. **Sklonuj repozytorium**

   ```bash
   git clone https://github.com/twoj-login/filament-explorer.git
   cd filament-explorer
   ```

2. **Zainstaluj zależności**

   ```
   npm install
   ```

3. **Uruchom serwer deweloperski**

   ```
   npm start
   ```

4. **Otwórz w przeglądarce**
   ```
   https://localhost:3000
   ```


## 📂 Struktura projektu

```
src/
├── components/
│   ├── FilamentCard.js   # Karta filamentu (nazwa, tagi, ewentualnie obrazek)
│   ├── SearchBar.js      # Pasek wyszukiwania + filtry
│
├── pages/
│   ├── Home.js           # Strona główna z listą filamentów
│
├── data/
│   ├── filaments.json    # Dane filamentów (materiał, kolor, marka, cechy)
│
├── App.js
└── index.js
```


## 📑 Struktura danych (filaments.json)

```json
  {
    "id": "1",
    "name": "PLA Biały Anycubic",
    "type": "PLA",
    "color": "Biały",
    "tags": {
      "material": ["PLA"],
      "type": ["Basic"],
      "brand": ["Anycubic"],
      "color": ["White"],
      "features": ["Ironing", "Shiny"]
    },
    "settings": {
      "Printer Settings": {
        "layer height": "0.2mm",
        "temperature": "190°C",
        "bed": "60°C",
        "glue": "not required"
      },
      "Printing Speeds": {
        "inner wall": "50mm/s",
        "outer wall": "50mm/s",
        "infill": "60mm/s",
        "initial layer": "15mm/s",
        "travel": "150mm/s"
      },
      "Retraction": {
        "length": "1mm",
        "speed": "25mm/s"
      },
      "Filament Details": {
        "diameter": "1.75mm",
        "flow": "98%"
      },
      "Ironing": {
        "pattern": "rectilinear",
        "speed": "15mm/s",
        "flow": "15%",
        "line spacing": "0.1mm",
        "inset": "0mm"
      }
    },
    "buyLink": "https://anycubicofficial.pl/products/filament-pla?variant=44750313390389",
    "image": "pla-bialy-ironing.jpg"
  }
```

- id – unikalny identyfikator filamentu
- name – nazwa filamentu (pokazywana w wyszukiwarce)
- tags – obiekt grupujący cechy filamentu według kategorii

👉 Dzięki temu tagi są dynamicznie zbierane i nie trzeba ich ręcznie mapować w kodzie.


## 🖥️ Instrukcja obsługi

1. Wyszukiwanie
   - Wpisz dowolną frazę w polu wyszukiwania, np. white, Anycubic.
   - Lista filtruje się w czasie rzeczywistym.
2. Filtrowanie
   - Rozwiń kategorię (np. Material, Color).
   - Zaznacz jeden lub więcej tagów.
   - Możesz łączyć filtry z różnych kategorii.
3. Zarządzanie filtrami
   - Toggle grupy: Kliknij przycisk w nagłówku grupy, aby zaznaczyć wszystkie tagi. Kliknij ponownie, aby wyczyścić.
   - Wyczyść wszystkie: Globalny przycisk resetujący wszystkie zaznaczone filtry.
4. Łączenie filtrów
   - Aplikacja pokazuje tylko filamenty spełniające każdy wybrany warunek.
   - Przykład: jeśli wybierzesz PLA (Material) + Gray (Color) → zobaczysz tylko szare filamenty PLA.


## 🛠️ Technologie

- ️ [⚛️ React](https://react.dev/) – framework do budowy interfejsu
- [📜 JavaScript (ES6+)](https://developer.mozilla.org/pl/docs/Web/JavaScript)
- 🎨 [CSS / Tailwind] – stylizacja komponentów
- [📦 npm](https://www.npmjs.com) – zarządzanie zależnościami

---

## 📌 TODO – pomysły na rozwój

- [ ] 🖼️ Dodanie zdjęć filamentów w kartach (FilamentCard)
- [ ] ⭐ System ocen/recenzji dla filamentów
- [ ] 💾 Eksport listy przefiltrowanych filamentów do CSV/PDF
- [ ] 🔄 Synchronizacja danych z lokalnym magazynem (np. IndexedDB)
- [ ] ☁️ Integracja z bazą w chmurze (np. Firebase, Supabase)
- [ ] ♻️ Kopiowanie wartości przez kliknięcie myszką