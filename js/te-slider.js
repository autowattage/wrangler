const hslsliders = document.querySelectorAll('input[type="range"].slider-progress');
// const h1img = document.getElementsByTagName('h1')[0].firstElementChild;
const h1img = document.getElementsByTagName('html')[0];

for (let e of hslsliders) {
  e.style.setProperty('--value', e.value);
  e.style.setProperty('--min', e.min == '' ? '0' : e.min);
  e.style.setProperty('--max', e.max == '' ? '100' : e.max);
  e.addEventListener('input', () => {
    e.style.setProperty('--value', e.value)
    // console.log(hslsliders[0].value);
    h1img.style.filter=`hue-rotate(${(hslsliders[0].value - 50)*2}deg) saturate(${hslsliders[1].value*2}%) brightness(${hslsliders[2].value/50}) `;
  });
}
