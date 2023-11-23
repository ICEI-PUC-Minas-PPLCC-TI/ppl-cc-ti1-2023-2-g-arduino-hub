let modal = document.querySelector("#modal");

document.querySelector('#add-post').addEventListener('click', openAddModal, false);

document.querySelector('#close-modal').addEventListener('click', closeModal, false);
window.addEventListener('click', event => { event.target == modal ? closeModal() : null; }, false);

let modalTitle = document.querySelector('#modal h3');
let modalButton = document.querySelector('#modal form button');

let inputName = document.querySelector('#modal form #title')
let inputQtd = document.querySelector('#modal form #qtd')

function openAddModal() {
  if (!isLogged()) {
    alert('Você precisa estar conectado para acessar essa página!');
    window.location.href = '../login.html';
  }


  modalTitle.innerHTML = 'Adicionar post';
  modalButton.innerHTML = 'Adicionar';

  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

