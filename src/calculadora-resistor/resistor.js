window.addEventListener("load", calcResistance, false);
document.colorSelect.addEventListener("change", calcResistance, false);



const displayBands = [document.querySelector('#band1'), document.querySelector('#band2'), document.querySelector('#band3'), document.querySelector('#band4')]
const bands = [document.colorSelect.band1, document.colorSelect.band2, document.colorSelect.band3, document.colorSelect.band4]


function calcResistance() {
  let firstDigit = bands[0].value;
  let secondDigit = bands[1].value;
  let multiplier = Number(bands[2].value);
  let tolerance = bands[3].value;

  let resistance = formatResistance(parseInt(`${firstDigit}${secondDigit}`) * multiplier);

  resistText = `${resistance} \u2126 \u00B1 ${tolerance}`;

  backgroundColors = []
  foregroungColors = []

  for (let i = 0; i < bands.length; i++) {
    backgroundColors[i] = getComputedStyle(bands[i].options[bands[i].selectedIndex]).backgroundColor;
    foregroungColors[i] = getComputedStyle(bands[i].options[bands[i].selectedIndex]).color;
  }

  for (let i = 0; i < bands.length; i++) {
    displayBands[i].style.backgroundColor = bands[i].style.backgroundColor = backgroundColors[i];
    bands[i].style.color = foregroungColors[i];
  }

  // Update the text box
  document.getElementById("resistorValue").innerHTML = resistText;
}

function formatResistance(resistanceValue) {
  resistance = resistanceValue;

  if (!Number.isInteger(resistanceValue)) {
    resistance = resistance.toFixed(2);
  }

  if (resistance >= 1000000) {
    resistance = (resistance / 1000000) + 'M';
  } else if (resistance >= 1000) {
    resistance = (resistance / 1000) + 'K';
  }

  return resistance;
}
