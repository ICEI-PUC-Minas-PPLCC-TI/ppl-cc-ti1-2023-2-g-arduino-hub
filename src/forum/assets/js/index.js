let postsList;

const form = document.querySelector('#modal form');

window.addEventListener('load', showPosts, false);
window.onbeforeunload = () => showPosts();
document.querySelector('#add-post').addEventListener('click', addPost, false);

// READ
async function loadPosts() {
	try { postsList = await (await fetch(`${apiURL}/posts`)).json() }
	catch (error) { console.error('Falha ao carregar posts:', error) }
}

function generateHTML(post) {
  const { id, titulo, categoria, comentarios, curtidas, conteudo, usuario } = post;
  const isAuthor = isLogged() && JSON.parse(sessionStorage.getItem('user')).id == usuario;

  return `
    <article ${isAuthor ? `class="autor"` : ''}>
      <a href="post.html?id=${id}">
        <h3 class="titulo">${titulo}</h3>
      </a>
      ${isAuthor ? `
      <div class="handle-item">
        <span>
          <button value="${id}" class="edit"><i class="fas fa-edit"></i></button>
          <button value="${id}" class="delete"><i class="fas fa-trash-alt"></i></button>
        </span>
      </div>` :
      '' }

      <div class="reactions">
        <span><i class="far fa-comment-alt"></i> ${comentarios.length}</span>
        <span><i class="${post.usuariosCurtidas.includes(user.id) ? 'fas' : 'far'} fa-thumbs-up"></i> ${curtidas}</span>
      </div>

      <p class="categoria">${categoria}</p>

      <p id="conteudo">${conteudo}</p>
    </article>`;
}

async function showPosts() {
  try {
    await loadPosts();

    const textoHTML = postsList.map(generateHTML).join('');

    document.querySelector("#posts").innerHTML = textoHTML;

    // Event listeners
    document.querySelectorAll('.edit').forEach(button => {
      button.addEventListener('click', editPost, false);
    });
    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', deletePost, false);
    });
  }
  catch (error) {
    console.error('Falha ao exibir os posts:', error);
  }
}

// CREATE
function addPost() {
  if (isLogged()) {
    openAddModal();

    form.removeEventListener('submit', handleEditSubmit, false);
    form.removeEventListener('submit', handleAddSubmit, false);
    form.addEventListener('submit', handleAddSubmit, false);
  } else {
    alert('Você precisa estar conectado para criar um novo post!');
    window.location.href = '../login.html';
  }
}

async function handleAddSubmit(event) {
  event.preventDefault();

  const newPost = {
    id: generateUUID(8),
    titulo: document.querySelector('#modal form #title').value,
    dataPostagem: Date.now(),
    autor: JSON.parse(sessionStorage.getItem('user')).name,
    usuario: JSON.parse(sessionStorage.getItem('user')).id,
    imagem: '',
    categoria: document.querySelector('#modal form #category').value,
    conteudo: document.querySelector('#modal form #content').value,
    curtidas: 0,
    usuariosCurtidas: [],
    comentarios: [],
  };

  try {
    const response = await fetch(`${apiURL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showPosts();
    closeModal();

  } catch (error) { console.error('Falha ao adicionar o post:', error); }
}

// UPDATE
function editPost() {
  id = this.value;
  const post = postsList.find(post => post.id == id);

  openEditModal(post);

  form.removeEventListener('submit', handleAddSubmit, false);
  form.removeEventListener('submit', handleEditSubmit, false);
  form.addEventListener('submit', handleEditSubmit, false);
}

async function handleEditSubmit(event) {
  event.preventDefault();

  const form = document.querySelector('#modal form');
  const updatedPost = {
    titulo: form.querySelector('#title').value,
    categoria: form.querySelector('#category').value,
    conteudo: form.querySelector('#content').value
  };

  try {
    const response = await fetch(`${apiURL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await showPosts();
    closeModal();
  } catch (error) {
    console.error('Falha ao atualizar o componente:', error);
  }
}



// DELETE
async function deletePost() {
  const id = this.value;
  const post = postsList.find(post => post.id == id);

  const confirmDelete = window.confirm(`Você realmente quer excluir ${post.titulo}?`);
  if (confirmDelete) {
    try {
      const response = await fetch(`${apiURL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showPosts();
    }
    catch (error) {
      console.error('Falha ao deletar o componente:', error);
    }
  }
}


// ORDER POSTS
document.querySelector('.order').addEventListener('input', order, false);

function order() {
  const orderType = document.querySelector('#order').value;
  console.log(orderType);

  const sortFunctions = {
    'date': (a, b) => new Date(b.dataPostagem) - new Date(a.dataPostagem),
    'likes': (a, b) => b.curtidas - a.curtidas
  };

  if (sortFunctions[orderType]) {
    const sortedPosts = postsList.sort(sortFunctions[orderType]);
    const textoHTML = sortedPosts.map(generateHTML).join('');
    document.querySelector("#posts").innerHTML = textoHTML;
  }
}
