let arduinoParts = [];

window.addEventListener('load', showParts, false);

const modal = document.querySelector("#modal");
document.querySelector('#close-modal').addEventListener('click', closeModal, false);
window.addEventListener('click', event => { event.target == modal ? closeModal() : null; }, false);

async function loadParts() {
  try { arduinoParts = await (await fetch(`${apiURL}/arduino`)).json() }
  catch (error) { console.error('Falha ao carregar componentes:', error)}
}

async function showParts() {
	await loadParts();

	const imageMap = document.querySelector('#image-map');
	const imageMapSm = document.querySelector('#image-map-sm');

	arduinoParts.forEach(part => {
		const coords = part.coords;
		const area = document.createElement('area');
		const areaSm = document.createElement('area');

		area.setAttribute('shape', 'circle');
		areaSm.setAttribute('shape', 'circle');

		area.setAttribute('coords', `${coords.x},${coords.y},${coords.radius}`);
		areaSm.setAttribute('coords', `${coords.smx},${coords.smy},${coords.smradius}`);

		area.setAttribute('title', part.name);
		areaSm.setAttribute('title', part.name);

		area.addEventListener('click', () => openModal(part), false);
		areaSm.addEventListener('click', () => openModal(part), false);

		imageMap.appendChild(area);
		imageMapSm.appendChild(areaSm);
	});
}

function openModal(part) {
	document.querySelector('#modal h3').innerHTML = part.name;
	document.querySelector('#modal div').innerHTML = `
		<img src="assets/img/arduino-parts/${part.id}.png" alt="${part.name}" />
		<p>${part.descricao}</p>
	`;

	modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}
