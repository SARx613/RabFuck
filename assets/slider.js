(function () {
  const container = document.getElementById("slideContainer");
  const thumb = document.getElementById("slideThumb");
  const fill = document.getElementById("slideFill");
  const label = document.getElementById("slideLabel");
  if (!container || !thumb) return;

  const PADDING = 3;
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
    if (fill) fill.style.transform = "scaleX(" + ratio + ")";
    if (label) label.style.opacity = String(1 - ratio * 1.4);
  }

  function pointerDown(e) {
    if (completed) return;
    dragging = true;
    thumb.style.transition = "none";
    if (fill) {
      fill.style.transition = "none";
      fill.style.transformOrigin = "left center";
    }
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
      thumb.style.transition = "left 0.2s ease";
      if (fill) fill.style.transition = "transform 0.2s ease";
      setPosition(0);
    }
  }

  function complete() {
    completed = true;
    container.classList.add("complete");
    if (label) {
      label.textContent = "¡Retirado!";
      label.style.opacity = "1";
      label.style.color = "#28a745";
      label.style.fontWeight = "600";
    }
    thumb.style.transition = "left 0.15s ease";
    if (fill) fill.style.transition = "transform 0.15s ease";
    setPosition(maxTravel());

    if (navigator.vibrate) navigator.vibrate(30);

    setTimeout(() => {
      window.location.href = "./confirmado.html";
    }, 500);
  }

  function getX(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return clientX - rect.left - thumb.clientWidth / 2;
  }

  thumb.addEventListener("mousedown", pointerDown);
  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("mouseup", pointerUp);

  thumb.addEventListener("touchstart", pointerDown, { passive: false });
  window.addEventListener("touchmove", pointerMove, { passive: false });
  window.addEventListener("touchend", pointerUp);

  window.addEventListener("resize", () => {
    if (!completed) setPosition(currentX);
  });

  setPosition(0);
})();
