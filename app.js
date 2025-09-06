let filaments = [];
let activeTag = "";

async function loadData() {
  const res = await fetch("data/filaments.json");
  filaments = await res.json();
  renderFilaments(filaments);
  populateTagFilter(filaments);
}

// renderowanie kart
function renderFilaments(list) {
  const grid = document.getElementById("filament-grid");
  grid.innerHTML = "";

  list.forEach(fil => {
    const card = document.createElement("div");
    card.className = "card";

    const notesKey = `notes_${fil.id}`;
    const savedNotes = localStorage.getItem(notesKey) || "";

    card.innerHTML = `
      <img src="${fil.img}" alt="${fil.name}">
      <h2>${fil.name}</h2>
      <p><b>Typ:</b> ${fil.type} | <b>Kolor:</b> ${fil.color}</p>
      <p><b>Temperatura:</b> ${fil.temp}</p>
      <div class="tags">
        ${fil.tags.map(t => `<span class="tag">${t}</span>`).join(" ")}
      </div>
      <p><a href="${fil.link}" target="_blank">🔗 Link do zakupu</a></p>
      <div class="notes">
        <label>📝 Notatki:</label>
        <textarea data-key="${notesKey}">${savedNotes}</textarea>
      </div>
    `;

    // obsługa notatek
    card.querySelector("textarea").addEventListener("input", e => {
      localStorage.setItem(notesKey, e.target.value);
    });

    grid.appendChild(card);
  });
}

// wyszukiwarka
document.getElementById("search").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  const filtered = filaments.filter(f =>
    f.name.toLowerCase().includes(val) ||
    f.type.toLowerCase().includes(val) ||
    f.color.toLowerCase().includes(val)
  );
  applyFilters(filtered);
});

// tag filter
function populateTagFilter(data) {
  const allTags = new Set();
  data.forEach(f => f.tags.forEach(t => allTags.add(t)));
  const select = document.getElementById("tagFilter");
  allTags.forEach(tag => {
    const opt = document.createElement("option");
    opt.value = tag;
    opt.textContent = tag;
    select.appendChild(opt);
  });
}

document.getElementById("tagFilter").addEventListener("change", e => {
  activeTag = e.target.value;
  applyFilters(filaments);
});

function applyFilters(list) {
  let filtered = list;
  if (activeTag) {
    filtered = filtered.filter(f => f.tags.includes(activeTag));
  }
  renderFilaments(filtered);
}

// dark mode toggle
document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkmode", document.body.classList.contains("dark"));
});

// zapamiętanie trybu ciemnego
if (localStorage.getItem("darkmode") === "true") {
  document.body.classList.add("dark");
}

loadData();
