(() => {
  const stage = document.getElementById("stage");
  const cards = Array.from(stage.querySelectorAll(".card"));
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const dotsWrap = document.getElementById("dots");

  let index = 0;

  // dots
  const dots = cards.map((_, i) => {
    const d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " is-on" : "");
    dotsWrap.appendChild(d);
    return d;
  });

  function clampIndex(i){
    const n = cards.length;
    return (i % n + n) % n;
  }

  function render(){
    const n = cards.length;
    dots.forEach((d, i) => d.classList.toggle("is-on", i === index));

    for (let i = 0; i < n; i++){
      const card = cards[i];
      const rel = clampIndex(i - index);

      // SOLID: no transparency for visible stack cards
      if (rel === 0){
        card.style.opacity = "1";
        card.style.transform = `translateX(0px) translateY(0px) scale(1)`;
        card.style.zIndex = "3";
      } else if (rel === 1){
        card.style.opacity = "1";
        card.style.transform = `translateX(28px) translateY(12px) scale(0.96)`;
        card.style.zIndex = "2";
      } else if (rel === 2){
        card.style.opacity = "1";
        card.style.transform = `translateX(52px) translateY(24px) scale(0.92)`;
        card.style.zIndex = "1";
      } else {
        card.style.opacity = "0";
        card.style.transform = `translateX(0px) translateY(40px) scale(0.90)`;
        card.style.zIndex = "0";
      }
    }
  }

  function go(dir){
    index = clampIndex(index + dir);
    render();
  }

  prev?.addEventListener("click", () => go(-1));
  next?.addEventListener("click", () => go(1));

  // Touch swipe
  let startX = 0, startY = 0, dragging = false;

  stage.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    dragging = true;
  }, { passive: true });

  stage.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    if (Math.abs(dy) > Math.abs(dx)) return; // allow vertical scroll
    if (Math.abs(dx) < 40) return;

    go(dx < 0 ? 1 : -1);
  });

  // Keyboard arrows (desktop)
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  render();
})();