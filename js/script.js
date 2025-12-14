// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("in");
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Count-up stats
function countUp(el, to) {
  const dur = 800;
  const t0 = performance.now();
  function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(to * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const metrics = document.querySelector(".metrics");
if (metrics) {
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      metrics.querySelectorAll("[data-count]").forEach((n) => {
        if (n.dataset.done) return;
        n.dataset.done = "1";
        countUp(n, Number(n.dataset.count));
      });
    });
  }, { threshold: 0.25 });
  statsIO.observe(metrics);
}

// Theme toggle
const root = document.documentElement;
const btn = document.getElementById("themeBtn");
const icon = document.getElementById("themeIcon");

function setTheme(t){
  root.setAttribute("data-theme", t);
  localStorage.setItem("venicura_theme", t);
  if (icon) icon.textContent = (t === "dark") ? "☾" : "☀";
}
setTheme(localStorage.getItem("venicura_theme") || root.getAttribute("data-theme") || "dark");
btn?.addEventListener("click", () => {
  const cur = root.getAttribute("data-theme") || "dark";
  setTheme(cur === "dark" ? "light" : "dark");
});

// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   Staff Board Drag + Drop
   ========================= */
let dragged = null;

document.querySelectorAll(".ticket").forEach((ticket) => {
  ticket.addEventListener("dragstart", (e) => {
    dragged = ticket;
    ticket.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ticket.dataset.id || "");
  });

  ticket.addEventListener("dragend", () => {
    ticket.classList.remove("dragging");
    dragged = null;
    document.querySelectorAll(".boardCol").forEach(c => c.classList.remove("drop-target"));
  });

  ticket.addEventListener("pointerdown", (e) => {
    ticket.setPointerCapture(e.pointerId);
    ticket.dataset.pointerDragging = "1";
    ticket.classList.add("dragging");
    dragged = ticket;
  });

  ticket.addEventListener("pointerup", () => {
    if (!ticket.dataset.pointerDragging) return;
    ticket.classList.remove("dragging");
    ticket.dataset.pointerDragging = "";
    dragged = null;
    document.querySelectorAll(".boardCol").forEach(c => c.classList.remove("drop-target"));
  });

  ticket.addEventListener("pointermove", (e) => {
    if (!ticket.dataset.pointerDragging) return;
    const col = document.elementFromPoint(e.clientX, e.clientY)?.closest(".boardCol");
    document.querySelectorAll(".boardCol").forEach(c => c.classList.remove("drop-target"));
    if (col) col.classList.add("drop-target");
  });
});

document.querySelectorAll(".boardCol").forEach((col) => {
  col.addEventListener("dragover", (e) => {
    e.preventDefault();
    col.classList.add("drop-target");
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  });

  col.addEventListener("dragleave", () => {
    col.classList.remove("drop-target");
  });

  col.addEventListener("drop", (e) => {
    e.preventDefault();
    col.classList.remove("drop-target");
    if (dragged) col.appendChild(dragged);
  });

  col.addEventListener("pointerup", () => {
    if (!dragged) return;
    if (!dragged.dataset.pointerDragging) return;
    col.appendChild(dragged);
    col.classList.remove("drop-target");
  });
});

// =========================
// Mobile Menu (single source of truth)
// =========================
(() => {
  const btn = document.getElementById("menuBtn");
  const panel = document.getElementById("menuPanel");
  const overlay = document.getElementById("menuOverlay");

  if (!btn || !panel || !overlay) return;

  const openMenu = () => {
    document.documentElement.classList.add("menuOpen");
    document.body.classList.add("menuOpen");

    panel.hidden = false;
    overlay.hidden = false;

    // force reflow so transitions work
    panel.offsetHeight;

    panel.classList.add("open");
    overlay.classList.add("open");

    btn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    document.documentElement.classList.remove("menuOpen");
    document.body.classList.remove("menuOpen");

    panel.classList.remove("open");
    overlay.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");

    setTimeout(() => {
      panel.hidden = true;
      overlay.hidden = true;
    }, 180);
  };

  btn.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("menuOpen");
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  panel.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();


/* Back to top */
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (!backToTop) return;
  if (window.scrollY > 320) backToTop.classList.add("show");
  else backToTop.classList.remove("show");
});
backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});