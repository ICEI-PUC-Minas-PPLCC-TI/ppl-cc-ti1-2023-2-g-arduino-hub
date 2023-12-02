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
      <li id="${id}-${usuario.slice(0, 8)}">${autor} - ${comentario}</li>
    `).join('');

		document.querySelector('.titulo').innerHTML = post.titulo;
		document.querySelector('.categoria').innerHTML = post.categoria;

    if (post.usuariosCurtidas.includes(user.id)) {
      document.querySelector('#curtir i').classList.replace('far', 'fas');
    } else {
      document.querySelector('#curtir i').classList.replace('fas', 'far');
    }

		document.querySelector('.qtde-curtidas').innerHTML = post.curtidas;
		document.querySelector('.autor').innerHTML = post.autor;


		document.querySelector('.conteudo').innerHTML = `<p>${post.conteudo}</p>`;

		document.querySelector('.comentarios').innerHTML = `${comentariosHTML}`;
  } catch (error) {
    console.error('Falha ao carregar e exibir os posts:', error);
  }
}

async function addComentario(event) {
  event.preventDefault();

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

async function curtir() {
  await loadPost();

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
