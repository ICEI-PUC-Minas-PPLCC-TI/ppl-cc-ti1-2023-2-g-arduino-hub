const apiURL = 'https://jsonserver--andreeluis.repl.co'
let userId;
let componentsList;
let id;

const form = document.querySelector('#modal form');



if (isLogged()) {
  userId = JSON.parse(sessionStorage.getItem('user')).id;
  window.addEventListener('load', showComponents, false);
  document.querySelector('#add-component').addEventListener('click', addComponent, false);
}
else {
  alert('Você precisa estar conectado para acessar essa página!');
  window.location.href = '../login.html';
}


// CREATE
function addComponent() {
  openAddModal();

  form.removeEventListener('submit', handleEditSubmit, false);
  form.removeEventListener('submit', handleAddSubmit, false);
  form.addEventListener('submit', handleAddSubmit, false);
}

async function handleAddSubmit(event) {
  event.preventDefault();

  const newComponent = {
    id: generateUUID(8),
    name: document.querySelector('#modal form #name').value,
    qtd: Number(document.querySelector('#modal form #qtd').value)
  };

  try {
    const response = await fetch(`${apiURL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ components: [...componentsList, newComponent] })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showComponents();
    closeModal();

  } catch (error) { console.error('Falha ao adicionar o componente:', error); }
}


// READ
async function loadComponents() {
  try { componentsList = (await (await fetch(`${apiURL}/users/${userId}`)).json()).components }
  catch (error) { console.error('Falha ao carregar componentes:', error)}
}

async function showComponents() {
  try {
    await loadComponents();

    const textoHTML = componentsList.map(component => `
    <li>
    <span class="qtd">${String(component.qtd).padStart(2, '0')}</span>
    ${component.name}
    <button value="${component.id}" class="edit"><i class="fas fa-edit"></i></button>
    <button value="${component.id}" class="delete"><i class="fas fa-trash-alt"></i></button>
    </li>
    `).join('');

    document.querySelector("#component-list").innerHTML = textoHTML;

    const editElements = document.querySelectorAll('.edit');
    const deleteElements = document.querySelectorAll('.delete');

    for (let i = 0; i < componentsList.length; i++) {
      editElements[i].addEventListener('click', editComponent, false);
      deleteElements[i].addEventListener('click', deleteComponent, false);
    }
  }
  catch (error) {
    console.error('Falha ao exibir os componentes:', error);
  }
}


// UPDATE
function editComponent() {
  id = this.value;
  const component = componentsList.find(component => component.id == id);

  openEditModal(component);

  form.removeEventListener('submit', handleAddSubmit, false);
  form.removeEventListener('submit', handleEditSubmit, false);
  form.addEventListener('submit', handleEditSubmit, false);
}

async function handleEditSubmit(event) {
  event.preventDefault();

  const updatedComponent = {
    id: id,
    name: document.querySelector('#modal form #name').value,
    qtd: Number(document.querySelector('#modal form #qtd').value)
  };

  try {
    console.log(componentsList);

    componentsList = componentsList.map(component => component.id == id ? updatedComponent : component);

    console.log(componentsList);

    const response = await fetch(`${apiURL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ components: componentsList })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showComponents();
    closeModal();
  } catch (error) { console.error('Falha ao atualizar o componente:', error); }
}


// DELETE
async function deleteComponent() {
  const id = this.value;
  const component = componentsList.find(component => component.id == id);

  const confirmDelete = window.confirm(`Você realmente quer excluir ${component.name}?`);
  if (confirmDelete) {
    try {
      componentsList = componentsList.filter(component => component.id != id);

      const response = await fetch(`${apiURL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ components: componentsList })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showComponents();
    }
    catch (error) {
      console.error('Falha ao deletar o componente:', error);
    }
  }
}
