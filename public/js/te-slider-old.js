for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
  e.style.setProperty('--value', e.value);
  e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}
