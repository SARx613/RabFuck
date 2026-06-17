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

  function lerpColor(a, b, t) {
    const ah = parseInt(a.slice(1), 16);
    const bh = parseInt(b.slice(1), 16);
    const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
    const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);
    return "#" + ((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1);
  }

  function maxTravel() {
    return container.clientWidth - thumb.clientWidth - PADDING * 2;
  }

  function setPosition(x) {
    maxX = maxTravel();
    currentX = Math.max(0, Math.min(x, maxX));
    thumb.style.left = PADDING + currentX + "px";
    if (fill) fill.style.width = thumb.clientWidth + currentX + "px";

    const ratio = maxX > 0 ? currentX / maxX : 0;
    if (label) label.style.opacity = String(1 - ratio * 1.4);

    if (fill && !completed) {
      fill.style.backgroundColor = lerpColor("#04252b", "#1a6b3a", ratio);
    }
  }

  function pointerDown(e) {
    if (completed) return;
    dragging = true;
    thumb.style.transition = "none";
    if (fill) fill.style.transition = "none";
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
      if (fill) fill.style.transition = "width 0.2s ease, background-color 0.2s ease";
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
    if (fill) fill.style.transition = "width 0.15s ease, background-color 0.15s ease";
    setPosition(maxTravel());

    if (navigator.vibrate) navigator.vibrate(30);

    setTimeout(function () {
      window.location.href = "./loading.html";
    }, 500);
  }

  function getX(e) {
    var rect = container.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return clientX - rect.left - thumb.clientWidth / 2;
  }

  thumb.addEventListener("mousedown", pointerDown);
  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("mouseup", pointerUp);

  thumb.addEventListener("touchstart", pointerDown, { passive: false });
  window.addEventListener("touchmove", pointerMove, { passive: false });
  window.addEventListener("touchend", pointerUp);

  window.addEventListener("resize", function () {
    if (!completed) setPosition(currentX);
  });

  setPosition(0);
})();
