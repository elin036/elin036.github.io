const wave = document.getElementById('wave');
const moon = document.getElementById('moon');
const earth = document.getElementById('earth');
const ring = document.getElementById('ring');

let isMoving = false;
let angle = Math.PI;
let sunNarration = false;
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

// Set inital position
document.addEventListener('DOMContentLoaded', function() {
  const earthPos = earth.getBoundingClientRect();
  const earthCenterX = earthPos.left + earthPos.width / 2;
  const earthCenterY = earthPos.top + earthPos.height / 2;

  if (!hasRing) {
    moon.style.top = '40%';
    moon.style.left = '30%';

    const MoonPos = moon.getBoundingClientRect();
    const moonX = MoonPos.left + MoonPos.width / 2;
    const moonY = MoonPos.top + MoonPos.height / 2;

    adjustWave(earthCenterX, earthCenterY, moonX, moonY);
  }
});

// Text narration
function readText(textBox, narrationText) {
  const fullText = narrationText.innerText;

  // Split into chunks using . or ;
  const texts = fullText.match(/[^\.;]+[\.;]+/g) || [fullText]; 
  narrationText.innerText = texts[0].trim();

  let currentTextIndex = 0;

  // Voice of the narration
  function speakText(text) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      window.speechSynthesis.speak(speech);
      return speech;
  }

  function narrateNextText() {
    if (currentTextIndex < texts.length) {
        narrationText.innerText = texts[currentTextIndex].trim();
        const speech = speakText(texts[currentTextIndex].trim());
        
        speech.onend = function() {
            currentTextIndex++;
            narrateNextText();
        };
    } 
    else {
        textBox.style.display = 'none';
    }
  }

  //1000 ms = 1 seconds
  setTimeout(() => {
      narrateNextText();
  }, 1500);
}

document.getElementById('start-btn').addEventListener('click', function(event) {
  this.style.display = 'none';
  // In case the moon is clicked
  event.stopPropagation();
  document.getElementById('earth-image').classList.add('shrinking');

  const hiddenElement = document.getElementById('hidden');
  hiddenElement.style.visibility = 'visible';
  hiddenElement.classList.add('fade-in');
  if (hasRing) {
    positionMoonOnRing(angle);
  }

  const narrationText = document.getElementsByClassName('narration-text')[0];
  const textBox = document.getElementsByClassName('text-box')[0];
  readText(textBox, narrationText);
});

// Click arrow for sun to appear
document.getElementById('sun-btn').addEventListener('click', function() {
  this.style.display = 'none';
  this.style.opacity = '0';

  const hiddenSun = document.getElementById('hidden-sun');
  hiddenSun.style.opacity = '1';
  hiddenSun.style.visibility = 'visible';

  const sun = document.getElementById('sun');
  sun.classList.remove('slide-out');
  sun.classList.add('slide-in');

  // Only narrate once
  if (!sunNarration) {
    const narrationText = document.getElementsByClassName('narration-text')[1];
    const textBox = document.getElementsByClassName('text-box')[1];
    readText(textBox, narrationText);
    
    sunNarration = true;
  }

});

// Click sun for sun to disappear and arrow to appear
document.getElementById('sun').addEventListener('click', function() {
  this.classList.remove('slide-in');
  this.classList.add('slide-out');

  const sunBtn = document.getElementById('sun-btn');
  
  setTimeout(function() {
    sunBtn.style.display = 'block'; 
    setTimeout(function() {
      sunBtn.style.opacity = '1';
    }, 10);
  });
});

// If moon is clicked
document.addEventListener('click', (event) => {
  const MoonPos = moon.getBoundingClientRect();
  if (
    event.clientX >= MoonPos.left &&
    event.clientX <= MoonPos.right &&
    event.clientY >= MoonPos.top &&
    event.clientY <= MoonPos.bottom
  ) {
    isMoving = !isMoving;
  }
});

// Moving the mouse
document.addEventListener('mousemove', (event) => {
  if (isMoving) {
    if (hasRing) {
      const ringPos = ring.getBoundingClientRect();
      const ringRadius = ringPos.width / 2;

      const earthCenterX = ringPos.left + ringRadius;
      const earthCenterY = ringPos.top + ringRadius;

      // Calculate the angle between mouse and Earth's center
      const deltaX = event.pageX - earthCenterX;
      const deltaY = event.pageY - earthCenterY;
      // Convert to radians
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
  // Moon centered around mouse
  moon.style.left = `${mouseX - moon.offsetWidth / 2}px`;
  moon.style.top = `${mouseY - moon.offsetHeight / 2}px`;

  const earthPos = earth.getBoundingClientRect();
  const earthCenterX = earthPos.left + earthPos.width / 2;
  const earthCenterY = earthPos.top + earthPos.height / 2;

  adjustWave(earthCenterX, earthCenterY, mouseX, mouseY);
}

// Has ring
function positionMoonOnRing(angle) {
  const ringPos = ring.getBoundingClientRect();
  const ringRadius = ringPos.width / 2;

  const earthCenterX = ringPos.left + ringRadius;
  const earthCenterY = ringPos.top + ringRadius;

  const moonX = earthCenterX + ringRadius * Math.cos(angle);
  const moonY = earthCenterY + ringRadius * Math.sin(angle);

  moon.style.left = `${moonX - moon.offsetWidth / 2}px`;
  moon.style.top = `${moonY - moon.offsetHeight / 2}px`;

  adjustWave(earthCenterX, earthCenterY, moonX, moonY);
}

function adjustWave(earthCenterX, earthCenterY, moonX, moonY) {
  const maxDistance = 400;
  const minDistance = 200;
  const maxWaveWidth = 350;
  const minWaveWidth = 200;

  const distanceX = moonX - earthCenterX;
  const distanceY = moonY - earthCenterY;
  const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

  const waveWidth = Math.max(minWaveWidth, maxWaveWidth - (distance / maxDistance) * (maxWaveWidth - minWaveWidth));

  wave.style.width = `${waveWidth}px`;
  wave.style.height = `200px`;

  // Makes sure it follows the moonS
  const angleDeg = Math.atan2(distanceY, distanceX) * (180 / Math.PI);
  wave.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
}

window.addEventListener('resize', () => {
  window.location.reload();
});







