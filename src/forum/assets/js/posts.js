const id = new URLSearchParams(location.search).get('id');
let post;

window.addEventListener('load', showPost, false);
document.querySelector('#comentar').addEventListener('submit', addComentario, false);
document.querySelector('#curtir').addEventListener('click', curtir, false);

async function loadPost() {
  try { post = await (await fetch(`${apiURL}/posts/${id}`)).json() }
  catch (error) { console.error('Falha ao carregar o post:', error) }
}

async function showPost() {
  try {
    await loadPost();

    const comentariosHTML = post.comentarios.map(({ id, usuario, autor, comentario }) => `
      <li id="${id}">
        ${autor} - ${comentario}
        ${isLogged() &&
          (JSON.parse(sessionStorage.getItem('user')).id == usuario ||
           JSON.parse(sessionStorage.getItem('user')).id == post.usuario)? `
          <div class="handle-item">
            <span>
              <button value="${id}" class="delete"><i class="fas fa-trash-alt"></i></button>
            </span>
          </div>` :
        '' }
      </li>
    `).join('');

		document.querySelector('.titulo').innerHTML = post.titulo;
		document.querySelector('.categoria').innerHTML = post.categoria;

    if (user && post.usuariosCurtidas.includes(user.id)) {
      document.querySelector('#curtir i').classList.replace('far', 'fas');
    } else {
      document.querySelector('#curtir i').classList.replace('fas', 'far');
    }

		document.querySelector('.qtde-curtidas').innerHTML = post.curtidas;
		document.querySelector('.autor').innerHTML = post.autor;


		document.querySelector('.conteudo').innerHTML = `<p>${post.conteudo}</p>`;

		document.querySelector('.comentarios').innerHTML = `${comentariosHTML}`;

    // Event listeners
    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', deleteComment, false);
    });
  } catch (error) {
    console.error('Falha ao carregar e exibir os posts:', error);
  }
}

async function addComentario(event) {
  event.preventDefault();

  if (!isLogged())
  {
    alert('Você precisa estar conectado para comentar em um post!');
    window.location.href = '../login.html';
  }

  await loadPost();

  const novoComentario = {
    id: generateUUID(8),
    autor: user.name,
    usuario: user.id,
    comentario: document.querySelector('#comentario').value,
  };

  fetch(`${apiURL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comentarios: [...post.comentarios, novoComentario] }),
  })
    .then(() => document.querySelector('#comentario').value = '')
    .then(() => showPost())
    .catch(error => {
      console.error('Erro ao inserir comentario via API JSONServer:', error);
    });
}

async function deleteComment() {
  const id = this.value;
  const comentario = post.comentarios.find(comentario => comentario.id == id);

  const confirmDelete = window.confirm(`Você realmente quer excluir o comentário: "${comentario.comentario}"?`);
  if (confirmDelete) {
    try {
      commentList = post.comentarios.filter(comentario => comentario.id != id);

      const response = await fetch(`${apiURL}/posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comentarios: commentList })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showPost();
    }
    catch (error) {
      console.error('Falha ao deletar o comentário:', error);
    }
  }
}

async function curtir() {
  await loadPost();

  if (!isLogged())
  {
    alert('Você precisa estar conectado para curtir um post!');
    window.location.href = '../login.html';
  }


  const usuariosCurtidas = post.usuariosCurtidas;

  if (!usuariosCurtidas.includes(user.id)) {
    fetch(`${apiURL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        curtidas: post.curtidas + 1,
        usuariosCurtidas: [...usuariosCurtidas, user.id],
      }),
    })
      .then(() => showPost())
      .catch(error => {
        console.error('Erro ao inserir curtida:', error);
      });
  }
  else {
    fetch(`${apiURL}/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        curtidas: post.curtidas - 1,
        usuariosCurtidas: usuariosCurtidas.filter(usuario => usuario !== user.id),
      }),
    })
      .then(() => showPost())
      .catch(error => {
        console.error('Erro ao remover curtida:', error);
      });
  }
}
