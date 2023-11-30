const id = new URLSearchParams(location.search).get('id');
let project;

window.addEventListener('load', showProject, false);

async function loadProject() {
  try { project = await (await fetch(`${apiURL}/projetos/${id}`)).json() }
  catch (error) { console.error('Falha ao carregar o projeto:', error) }
}

async function showProject() {
  try {
    await loadProject();

    document.querySelector('.titulo').innerHTML = project.titulo;
		document.querySelector('.categoria').innerHTML = project.categoria;
		document.querySelector('.autor').innerHTML = project.autor;


		document.querySelector('.conteudo').innerHTML = `<p>${project.conteudo}</p>`;
  } catch (error) {
    console.error('Falha ao carregar e exibir os posts:', error);
  }
}

async function addComentario(event) {
  event.preventDefault();

  await loadPost();

  const novoComentario = {
    id: generateUUID(8),
    autor: JSON.parse(sessionStorage.getItem('user')).name,
    usuario: JSON.parse(sessionStorage.getItem('user')).id,
    comentario: document.querySelector('#comentario').value,
  };

  fetch(`${apiURL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    //body: JSON.stringify({ novoComentario }),
    body: JSON.stringify({ comentarios: [...post.comentarios, novoComentario] }),
  })
    .then(() => showPost())
    .catch(error => {
      console.error('Erro ao inserir comentario via API JSONServer:', error);
    });
}

async function addCurtida() {
  await loadPost();

  fetch(`${apiURL}/posts/${id}`, {
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
