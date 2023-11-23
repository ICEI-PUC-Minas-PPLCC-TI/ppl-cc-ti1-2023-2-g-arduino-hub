const apiUrl = 'https://jsonserver.joao-paulopa392.repl.co';
let postsList;

window.addEventListener('load', showPosts, false)

document.querySelector('#modal form').addEventListener('submit', addPost, false);


// READ
async function loadPosts() {
	try { postsList = await (await fetch(`${apiUrl}/posts`)).json() }
	catch (error) { console.error('Falha ao carregar posts:', error) }
}

async function showPosts() {
  try {
    await loadPosts();

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


// CREATE
async function addPost(event) {
  event.preventDefault();

  const newPost = {
    id: generateUUID(8),
    titulo: document.querySelector('#modal form #title').value,
    autor: JSON.parse(sessionStorage.getItem('user')).name,
    usuario: JSON.parse(sessionStorage.getItem('user')).id,
    imagem: '',
    categoria: document.querySelector('#modal form #category').value,
    conteudo: document.querySelector('#modal form #content').value,
    curtidas: 0,
    comentarios: [],
  };

  try {
    const response = await fetch(`${apiUrl}/posts`, {
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
