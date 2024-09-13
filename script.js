const wave = document.getElementById('wave');
const moon = document.getElementById('moon');
const earth = document.getElementById('earth');
const ring = document.getElementById('ring');

let isMoving = false;
let angle = Math.PI;

function createStar() {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.top = `${Math.random() * window.innerHeight}px`;
  star.style.left = `${Math.random() * window.innerWidth}px`;
  document.body.appendChild(star);
}

for (let i = 0; i < 150; i++) {
  createStar();
}

document.getElementById('start-btn').addEventListener('click', function(event) {
  event.stopPropagation();
  document.getElementById('earth-image').classList.add('shrinking');
  const hiddenElement = document.getElementById('hidden');
  hiddenElement.style.visibility = 'visible';
  hiddenElement.classList.add('fade-in');
  positionMoon(angle);
});

document.addEventListener('click', (event) => {
  const moonRect = moon.getBoundingClientRect();
  if (
    event.clientX >= moonRect.left &&
    event.clientX <= moonRect.right &&
    event.clientY >= moonRect.top &&
    event.clientY <= moonRect.bottom
  ) {
    isMoving = !isMoving;
  }
});

document.addEventListener('mousemove', (event) => {
  if (isMoving) {
    const ringRect = ring.getBoundingClientRect();
    const ringRadius = ringRect.width / 2;

    const earthCenterX = ringRect.left + ringRadius;
    const earthCenterY = ringRect.top + ringRadius;

    const deltaX = event.pageX - earthCenterX;
    const deltaY = event.pageY - earthCenterY;
    angle = Math.atan2(deltaY, deltaX);

    positionMoon(angle);
  }
});

function positionMoon(angle) {
  const ringRect = ring.getBoundingClientRect();
  const ringRadius = ringRect.width / 2;

  const earthCenterX = ringRect.left + ringRadius;
  const earthCenterY = ringRect.top + ringRadius;

  const moonX = earthCenterX + ringRadius * Math.cos(angle);
  const moonY = earthCenterY + ringRadius * Math.sin(angle);

  moon.style.left = `${moonX - moon.offsetWidth / 2}px`;
  moon.style.top = `${moonY - moon.offsetHeight / 2}px`;

  const distanceX = moonX - earthCenterX;
  const distanceY = moonY - earthCenterY;
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

  const maxDistance = 400; // Maximum distance for full stretch
  const minDistance = 200;  // Minimum distance for full shrink
  const maxWaveWidth = 350; // Maximum wave width when the moon is closest
  const minWaveWidth = 200; // Minimum wave width when the moon is farthest

  const waveWidth = Math.max(minWaveWidth, maxWaveWidth - (distance / maxDistance) * (maxWaveWidth - minWaveWidth));
  
  wave.style.width = `${waveWidth}px`;
  wave.style.height = `200px`;

  const angleDeg = Math.atan2(distanceY, distanceX) * (180 / Math.PI);
  wave.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
}

positionMoon(angle);
// Resize event listener to reload the page
window.addEventListener('resize', () => {
  window.location.reload();
});







