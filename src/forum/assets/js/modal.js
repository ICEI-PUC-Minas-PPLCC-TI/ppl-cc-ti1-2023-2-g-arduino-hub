let modal = document.querySelector("#modal");

document.querySelector('#close-modal').addEventListener('click', closeModal, false);
window.addEventListener('click', event => { event.target == modal ? closeModal() : null; }, false);

let modalTitle = document.querySelector('#modal h3');
let modalButton = document.querySelector('#modal form button');

let inputTitle = document.querySelector('#modal form #title');
let inputCategory = document.querySelector('#modal form #category');
let inputContent = document.querySelector('#modal form #content');

function openAddModal() {
  modalTitle.innerHTML = 'Adicionar post';
  modalButton.innerHTML = 'Adicionar';

  inputTitle.value = '';
  inputCategory.value = '';
  inputContent.value = '';

  modal.style.display = "block";
}

function openEditModal(post) {
  modalTitle.innerHTML = 'Editar post';
  modalButton.innerHTML = 'Editar';

  inputTitle.value = post.titulo;
  inputCategory.value = post.categoria;
  inputContent.value = post.conteudo;

  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

