let projectsList;

const Dificuldades = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil'
};

const form = document.querySelector('#modal form');

window.addEventListener('load', ShowProjects, false);
document.querySelector('#add-project').addEventListener('click', addProject, false);

// READ
async function LoadProjects() {
  try { projectsList = await (await fetch(`${apiURL}/projetos`)).json() }
  catch (error) { console.error('Falha ao carregar os projetos:', error) }
}

function generateHTML(project) {
  const { id, titulo, categoria, dificuldade, conteudo, imagem, autor, usuario } = project;
  const isAuthor = isLogged() && JSON.parse(sessionStorage.getItem('user')).id == usuario;

  return `
    <article ${isAuthor ? `class="autor"` : ''}>
      <a href="projeto.html?id=0">
        <h3 class="titulo">${titulo}</h3>
      </a>
      <p class="categoria">${categoria}</p>
      <p class="dificuldade ${dificuldade}">${Dificuldades[dificuldade]}</p>
      ${isAuthor ? `
        <div class="handle-item">
          <span>
            <button value="${id}" class="edit"><i class="fas fa-edit"></i></button>
            <button value="${id}" class="delete"><i class="fas fa-trash-alt"></i></button>
          </span>
        </div>` :
        '' }

      <p id="conteudo">${conteudo}</p>
    </article>
  `;
}

async function ShowProjects() {
  try {
    await LoadProjects();

    const textoHTML = projectsList.map(generateHTML).join('');

    document.querySelector("#projects").innerHTML = textoHTML;

    // Event listeners
    document.querySelectorAll('.edit').forEach(button => {
      button.addEventListener('click', editProject, false);
    });
    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', deleteProject, false);
    });
  }
  catch (error) {
    console.error('Falha ao exibir os projetos:', error);
  }
}

// CREATE
function addProject() {
  console.log('addPost()');
  if (isLogged()) {
    openAddModal();

    form.removeEventListener('submit', handleEditSubmit, false);
    form.removeEventListener('submit', handleAddSubmit, false);
    form.addEventListener('submit', handleAddSubmit, false);
  } else {
    alert('Você precisa estar conectado para criar um novo projeto!');
    window.location.href = '../login.html';
  }
}

async function handleAddSubmit(event) {
  event.preventDefault();

  const newProject = {
    id: generateUUID(8),
    titulo: document.querySelector('#modal form #title').value,
    categoria: document.querySelector('#modal form #category').value,
    dificuldade: document.querySelector('#modal form #difficulty').value,
    conteudo: document.querySelector('#modal form #content').value,
    imagem: '',
    autor: JSON.parse(sessionStorage.getItem('user')).name,
    usuario: JSON.parse(sessionStorage.getItem('user')).id
  };

  try {
    const response = await fetch(`${apiURL}/projetos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    ShowProjects();
    closeModal();

  } catch (error) { console.error('Falha ao adicionar o projeto:', error); }
}


// UPDATE
function editProject() {
  id = this.value;
  const project = projectsList.find(project => project.id == id);

  openEditModal(project);

  form.removeEventListener('submit', handleAddSubmit, false);
  form.removeEventListener('submit', handleEditSubmit, false);
  form.addEventListener('submit', handleEditSubmit, false);
}

async function handleEditSubmit(event) {
  event.preventDefault();

  const updatedProject = {
    titulo: document.querySelector('#modal form #title').value,
    categoria: document.querySelector('#modal form #category').value,
    dificuldade: document.querySelector('#modal form #difficulty').value,
    conteudo: document.querySelector('#modal form #content').value
  };

  try {
    const response = await fetch(`${apiURL}/projetos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await ShowProjects();
    closeModal();
  } catch (error) {
    console.error('Falha ao atualizar o projeto:', error);
  }
}


// DELETE
async function deleteProject() {
  const id = this.value;
  const project = projectsList.find(project => project.id == id);

  const confirmDelete = window.confirm(`Você realmente quer excluir ${project.titulo}?`);
  if (confirmDelete) {
    try {
      const response = await fetch(`${apiURL}/projetos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      ShowProjects();
    }
    catch (error) {
      console.error('Falha ao deletar o projeto:', error);
    }
  }
}
