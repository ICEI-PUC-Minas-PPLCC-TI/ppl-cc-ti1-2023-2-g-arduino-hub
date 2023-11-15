let modal = document.querySelector("#modal");

document.querySelector('#close-modal').addEventListener('click', closeModal, false);
window.addEventListener('click', event => { event.target == modal ? closeModal() : null; }, false);

let modalTitle = document.querySelector('#modal h3');
let modalButton = document.querySelector('#modal form button');

let inputName = document.querySelector('#modal form #name')
let inputQtd = document.querySelector('#modal form #qtd')

function openEditModal(component) {
  modalTitle.innerHTML = 'Editar componente';
  modalButton.innerHTML = 'Editar';

  inputName.value = component.name;
  inputQtd.value = component.qtd;

  modal.style.display = "block";
}

function openAddModal() {
  modalTitle.innerHTML = 'Adicionar componente';
  modalButton.innerHTML = 'Adicionar';

  inputName.value = '';
  inputQtd.value = '';

  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}
