const wave = document.getElementById('wave');
const moon = document.getElementById('moon');
const earth = document.getElementById('earth');
const ring = document.getElementById('ring');

let isMoving = false;
let angle = Math.PI;
const hasRing = ring !== null;

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
  document.getElementById('start-btn').style.display = 'none';
  event.stopPropagation();
  document.getElementById('earth-image').classList.add('shrinking');
  const hiddenElement = document.getElementById('hidden');
  hiddenElement.style.visibility = 'visible';
  hiddenElement.classList.add('fade-in');
  if (hasRing) {
    positionMoonOnRing(angle);
  }
});

// Set inital position for no ring
document.addEventListener('DOMContentLoaded', function() {
  const earthRect = earth.getBoundingClientRect();
  const earthCenterX = earthRect.left + earthRect.width / 2;
  const earthCenterY = earthRect.top + earthRect.height / 2;

  if (!hasRing) {
    moon.style.top = '40%';
    moon.style.left = '30%';

    const moonRect = moon.getBoundingClientRect();
    const moonX = moonRect.left + moonRect.width / 2;
    const moonY = moonRect.top + moonRect.height / 2;

    adjustWave(earthCenterX, earthCenterY, moonX, moonY);
  }
});

// If moon is clicked
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

// Moving the mouse
document.addEventListener('mousemove', (event) => {
  if (isMoving) {
    if (hasRing) {
      const ringRect = ring.getBoundingClientRect();
      const ringRadius = ringRect.width / 2;

      const earthCenterX = ringRect.left + ringRadius;
      const earthCenterY = ringRect.top + ringRadius;

      const deltaX = event.pageX - earthCenterX;
      const deltaY = event.pageY - earthCenterY;
      angle = Math.atan2(deltaY, deltaX);

      positionMoonOnRing(angle);
    } 
    else {
      moveMoon(event.pageX, event.pageY);
    }
  }
});

// Doesn't have ring
function moveMoon(mouseX, mouseY) {
  moon.style.left = `${mouseX - moon.offsetWidth / 2}px`;
  moon.style.top = `${mouseY - moon.offsetHeight / 2}px`;

  const earthRect = earth.getBoundingClientRect();
  const earthCenterX = earthRect.left + earthRect.width / 2;
  const earthCenterY = earthRect.top + earthRect.height / 2;

  adjustWave(earthCenterX, earthCenterY, mouseX, mouseY);
}

// Has ring
function positionMoonOnRing(angle) {
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

  adjustWave(earthCenterX, earthCenterY, moonX, moonY);
}

function adjustWave(earthCenterX, earthCenterY, moonX, moonY) {
  const distanceX = moonX - earthCenterX;
  const distanceY = moonY - earthCenterY;
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

  const maxDistance = 400;
  const minDistance = 200;
  const maxWaveWidth = 350;
  const minWaveWidth = 200;

  const waveWidth = Math.max(minWaveWidth, maxWaveWidth - (distance / maxDistance) * (maxWaveWidth - minWaveWidth));

  wave.style.width = `${waveWidth}px`;
  wave.style.height = `200px`;

  const angleDeg = Math.atan2(distanceY, distanceX) * (180 / Math.PI);
  wave.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
}

window.addEventListener('resize', () => {
  window.location.reload();
});







