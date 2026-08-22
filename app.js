let figuresData = [], filteredData = [], currentPage = 1, itemsPerPage = 20;

document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("data/figures.json");
    figuresData = await res.json();
    filteredData = [...figuresData];
    initFilters();
    renderGrid();
    setupEvents();
});

function initFilters() {
    const cats = ["الكل", ...new Set(figuresData.map(f => f.category))];
    document.getElementById("categoryFilters").innerHTML = cats.map(c => `
        <button class="w-full text-right px-3 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-800" onclick="filterCategory('${c}')">${c}</button>
    `).join("");
}

function filterCategory(c) {
    filteredData = c === "الكل" ? [...figuresData] : figuresData.filter(f => f.category === c);
    currentPage = 1;
    renderGrid();
}

function renderGrid() {
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filteredData.slice(start, start + itemsPerPage);
    document.getElementById("resultsCount").innerText = `عرض ${filteredData.length} شخصية`;
    document.getElementById("pageIndicator").innerText = `${currentPage} / ${Math.ceil(filteredData.length / itemsPerPage) || 1}`;

    document.getElementById("figuresGrid").innerHTML = pageItems.map(fig => `
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 card-hover cursor-pointer" onclick="openModal('${fig.id}')">
            <img src="${fig.main_image}" class="w-full h-48 object-cover rounded-lg mb-3">
            <h3 class="font-bold text-slate-100 text-base mb-1">${fig.name}</h3>
            <p class="text-xs text-amber-500 mb-2">${fig.category} • ${fig.era}</p>
            <p class="text-xs text-slate-400 line-clamp-2">${fig.short_bio}</p>
        </div>
    `).join("");
}

function openModal(id) {
    const fig = figuresData.find(f => f.id === id);
    if (!fig) return;

    document.getElementById("modalHeader").innerHTML = `
        <div class="flex items-center gap-4">
            <img src="${fig.main_image}" class="w-16 h-16 rounded-full object-cover border-2 border-amber-500">
            <div>
                <h2 class="text-xl font-bold text-white">${fig.name}</h2>
                <p class="text-xs text-amber-400">${fig.title} (${fig.birth_year} - ${fig.death_year})</p>
            </div>
        </div>`;

    document.getElementById("tab-timeline").innerHTML = `
        <p class="text-sm text-slate-300 mb-4">${fig.full_bio}</p>
        <h4 class="text-xs font-bold text-slate-400 uppercase mb-3">اللحظات المفصلية</h4>
        ${fig.timeline.map(t => `<div class="mb-3 text-xs"><span class="text-amber-400 font-bold">${t.year}: </span><span class="text-slate-200">${t.event_title}</span></div>`).join("")}`;

    document.getElementById("tab-ages").innerHTML = `
        <div class="grid grid-cols-3 gap-3">
            ${fig.age_stages.map(s => `
                <div class="bg-slate-950 p-2 rounded text-center">
                    <img src="${s.image_url}" class="w-full h-32 object-cover rounded mb-2">
                    <p class="text-xs font-bold text-amber-400">${s.stage_name}</p>
                </div>
            `).join("")}
        </div>`;

    document.getElementById("tab-awards").innerHTML = fig.awards.map(a => `<div class="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-200"><i class="fa-solid fa-award text-amber-400 ml-2"></i><b>${a.award_name}</b> (${a.year_received})</div>`).join("");
    
    document.getElementById("detailModal").classList.remove("hidden");
}

function setupEvents() {
    document.getElementById("closeModal").onclick = () => document.getElementById("detailModal").classList.add("hidden");
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active", "text-amber-400"));
            btn.classList.add("active", "text-amber-400");
            document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
            document.getElementById(btn.dataset.tab).classList.remove("hidden");
        };
    });
}