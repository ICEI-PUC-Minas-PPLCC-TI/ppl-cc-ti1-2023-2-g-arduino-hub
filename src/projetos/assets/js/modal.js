const modal = document.querySelector("#modal");

document.querySelector('#close-modal').addEventListener('click', closeModal, false);
window.addEventListener('click', event => { event.target == modal ? closeModal() : null; }, false);

const modalTitle = document.querySelector('#modal h3');
const modalButton = document.querySelector('#modal form button');

const inputTitle = document.querySelector('#modal form #title');
const inputCategory = document.querySelector('#modal form #category');
const inputDifficulty = document.querySelector('#modal form #difficulty');
const inputContent = document.querySelector('#modal form #content');

function openAddModal() {
  modalTitle.innerHTML = 'Adicionar post';
  modalButton.innerHTML = 'Adicionar';

  inputTitle.value = '';
  inputCategory.value = '';
  inputContent.value = '';

  modal.style.display = "block";
}

function openEditModal(project) {
  modalTitle.innerHTML = 'Editar post';
  modalButton.innerHTML = 'Editar';

  inputTitle.value = project.titulo;
  inputCategory.value = project.categoria;
  inputDifficulty.value = project.dificuldade;
  inputContent.value = project.conteudo;

  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

