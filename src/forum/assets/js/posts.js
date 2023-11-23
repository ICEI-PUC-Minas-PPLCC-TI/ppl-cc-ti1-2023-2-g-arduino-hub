const apiUrl = 'https://jsonserver.joao-paulopa392.repl.co';
const id = new URLSearchParams(location.search).get('id');
let post;

window.addEventListener('load', showPost, false);
document.querySelector('#comentar').addEventListener('submit', addComentario, false);
document.querySelector('#curtir').addEventListener('click', addCurtida, false);

async function loadPost() {
  try { post = await (await fetch(`${apiUrl}/posts/${id}`)).json() }
  catch (error) { console.error('Falha ao carregar o post:', error) }
}

async function showPost() {
  try {
    await loadPost();

    const comentariosHTML = post.comentarios.map(({ usuario, comentario }) => `
      <li>${usuario} - ${comentario}</li>
    `).join('');

		document.querySelector('.titulo').innerHTML = post.titulo;
		document.querySelector('.categoria').innerHTML = post.categoria;
		document.querySelector('.qtde-curtidas').innerHTML = post.curtidas;
		document.querySelector('.autor').innerHTML = post.usuario;


		document.querySelector('.conteudo').innerHTML = `<p>${post.conteudo}</p>`;

		document.querySelector('.comentarios').innerHTML = `${comentariosHTML}`;
  } catch (error) {
    console.error('Falha ao carregar e exibir os posts:', error);
  }
}

async function addComentario(event) {
  event.preventDefault();

  await loadPost();

  const novoComentario = document.querySelector('#comentario').value;

  fetch(`${apiUrl}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    //body: JSON.stringify({ novoComentario }),
    body: JSON.stringify({ comentarios: [...post.comentarios, { usuario: 'aaaTeste', comentario: novoComentario }] }),
  })
    .then(() => showPost())
    .catch(error => {
      console.error('Erro ao inserir comentario via API JSONServer:', error);
    });
}

async function addCurtida() {
  await loadPost();

  fetch(`${apiUrl}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ curtidas: post.curtidas + 1 }),
  })
    .then(() => showPost())
    .catch(error => {
      console.error('Erro ao inserir curtida via API JSONServer:', error);
    });
}
