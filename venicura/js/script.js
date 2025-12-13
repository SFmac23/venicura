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
  icon.textContent = (t === "dark") ? "☾" : "☀";
}
setTheme(localStorage.getItem("venicura_theme") || root.getAttribute("data-theme") || "dark");
btn?.addEventListener("click", () => {
  const cur = root.getAttribute("data-theme") || "dark";
  setTheme(cur === "dark" ? "light" : "dark");
});

// Year
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================
   Staff Board Drag + Drop
   ========================= */
let dragged = null;

function isTicket(el) {
  return el && el.classList && el.classList.contains("ticket");
}

document.querySelectorAll(".ticket").forEach((ticket) => {
  // Desktop drag
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

  // Touch + mobile: pointer-based dragging
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

// Column drop zones
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

  // Touch drop: on pointerup, move into hovered column
  col.addEventListener("pointerup", () => {
    if (!dragged) return;
    // Only move if it's in pointer-drag mode
    if (!dragged.dataset.pointerDragging) return;
    col.appendChild(dragged);
    col.classList.remove("drop-target");
  });
});


(() => {
  const btn = document.getElementById("menuBtn");
  const panel = document.getElementById("menuPanel");
  const overlay = document.getElementById("menuOverlay");

  if (!btn || !panel || !overlay) return;

  const openMenu = () => {
    document.documentElement.classList.add("menuOpen");
    panel.hidden = false;
    overlay.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add("open");
      overlay.classList.add("open");
    });
    btn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    document.documentElement.classList.remove("menuOpen");
    panel.classList.remove("open");
    overlay.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    setTimeout(() => {
      panel.hidden = true;
      overlay.hidden = true;
    }, 180);
  };

  btn.addEventListener("click", () => {
    const isOpen = document.documentElement.classList.contains("menuOpen");
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  panel.addEventListener("click", (e) => {
    if (e.target.matches("a")) closeMenu();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();



const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay"); // the blurred overlay div

function openMenu(){
  document.body.classList.add("menuOpen");
  mobileMenu.classList.add("open");
  menuOverlay.classList.add("open");
}

function closeMenu(){
  document.body.classList.remove("menuOpen");
  mobileMenu.classList.remove("open");
  menuOverlay.classList.remove("open");
}

menuBtn?.addEventListener("click", () => {
  const isOpen = document.body.classList.contains("menuOpen");
  isOpen ? closeMenu() : openMenu();
});

menuOverlay?.addEventListener("click", closeMenu);

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 320) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});