const apiUrl = 'https://jsonserver.joao-paulopa392.repl.co';
let postsList;

window.addEventListener('load', showPosts, false)

btnExcluir = document.getElementById('excluir');
btnExcluir.addEventListener('click', deletePosts, false)

// READ
async function loadPosts() {
	try { postsList = await (await fetch(`${apiUrl}/posts`)).json() }
	catch (error) { console.error('Falha ao carregar posts:', error) }
}

async function showPosts() {
  try {
    await loadPosts();

    console.log(postsList[1].comentarios.length);

    const textoHTML = postsList.map(post => `
    <article>
      <a href="post.html?id=${post.id}">
        <h3 class="titulo">${post.titulo}</h3>
        <p class="categoria">${post.categoria}</p>

        <div class="engajamento">
          <span><i class="far fa-comment-alt"></i> ${post.comentarios.length}</span>
          <span><i class="far fa-thumbs-up"></i> ${post.curtidas}</span>
        </div>

        <p id="conteudo">${post.conteudo}</p>
      </a>
    </article>
    `).join('');

    document.querySelector("#posts").innerHTML = textoHTML;
  }
  catch (error) {
    console.error('Falha ao exibir os posts:', error);
  }
}




//document.querySelector('#add-component').addEventListener('click', addComponent, false);

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
    name: document.querySelector('#modal form #name').value,
    qtd: Number(document.querySelector('#modal form #qtd').value)
  };

  try {
    const response = await fetch(`${apiURL}/componentes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComponent),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showComponents();
    closeModal();

  } catch (error) { console.error('Falha ao adicionar o componente:', error); }
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
    name: document.querySelector('#modal form #name').value,
    qtd: Number(document.querySelector('#modal form #qtd').value)
  };

  try {
    const response = await fetch(`${apiURL}/componentes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedComponent),
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
      const response = await fetch(`${apiURL}/componentes/${id}`, {
        method: 'DELETE',
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
