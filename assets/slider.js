/* ============================================================
   Slide-to-confirm control (Page 2).
   Drag the thumb fully to the right to validate and move on
   to the confirmation page.
   ============================================================ */
(function () {
  const container = document.getElementById("slideContainer");
  const thumb = document.getElementById("slideThumb");
  const fill = document.getElementById("slideFill");
  const label = document.getElementById("slideLabel");
  if (!container || !thumb) return;

  const PADDING = 4;          // matches CSS thumb offset
  let dragging = false;
  let startX = 0;
  let currentX = 0;
  let maxX = 0;
  let completed = false;

  function maxTravel() {
    return container.clientWidth - thumb.clientWidth - PADDING * 2;
  }

  function setPosition(x) {
    maxX = maxTravel();
    currentX = Math.max(0, Math.min(x, maxX));
    thumb.style.left = PADDING + currentX + "px";
    fill.style.width = thumb.clientWidth + currentX + "px";
    const ratio = maxX > 0 ? currentX / maxX : 0;
    label.style.opacity = String(1 - ratio * 1.4);
  }

  function pointerDown(e) {
    if (completed) return;
    dragging = true;
    thumb.style.transition = "none";
    fill.style.transition = "none";
    startX = getX(e) - currentX;
    e.preventDefault();
  }

  function pointerMove(e) {
    if (!dragging) return;
    setPosition(getX(e) - startX);
  }

  function pointerUp() {
    if (!dragging) return;
    dragging = false;
    maxX = maxTravel();

    if (currentX >= maxX - 6) {
      complete();
    } else {
      // Snap back
      thumb.style.transition = "left 0.2s ease";
      fill.style.transition = "width 0.2s ease";
      setPosition(0);
    }
  }

  function complete() {
    completed = true;
    container.classList.add("complete");
    label.textContent = "¡Listo!";
    label.style.opacity = "0";
    thumb.style.transition = "left 0.15s ease";
    fill.style.transition = "width 0.15s ease";
    setPosition(maxTravel());

    if (navigator.vibrate) navigator.vibrate(30);

    setTimeout(() => {
      window.location.href = "./confirmado.html";
    }, 350);
  }

  function getX(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return clientX - rect.left - thumb.clientWidth / 2;
  }

  // Mouse
  thumb.addEventListener("mousedown", pointerDown);
  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("mouseup", pointerUp);

  // Touch
  thumb.addEventListener("touchstart", pointerDown, { passive: false });
  window.addEventListener("touchmove", pointerMove, { passive: false });
  window.addEventListener("touchend", pointerUp);

  // Keep position consistent on resize
  window.addEventListener("resize", () => {
    if (!completed) setPosition(currentX);
  });

  setPosition(0);
})();
