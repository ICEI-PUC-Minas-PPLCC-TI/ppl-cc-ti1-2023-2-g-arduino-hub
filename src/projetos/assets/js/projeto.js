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


		document.querySelector('.conteudo').innerHTML = `<p>${project.conteudo.replaceAll('\n', '<br>')}</p>`;
  } catch (error) {
    console.error('Falha ao carregar e exibir os posts:', error);
  }
}
