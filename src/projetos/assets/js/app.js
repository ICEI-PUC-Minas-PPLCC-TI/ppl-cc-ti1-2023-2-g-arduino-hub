let projectsList;

window.addEventListener('load', ShowProjects, false);


async function LoadProjects() {
  try { projectsList = await (await fetch(`${apiURL}/projetos`)).json() }
  catch (error) { console.error('Falha ao carregar os projetos:', error) }
}

async function ShowProjects() {
  try {
    await LoadProjects();

    const textoHTML = projectsList.map(project => `
      <article>
        <a href="projeto.html?id=0">
          <h3 class="titulo">${project.titulo}</h3>
        </a>
        <p class="categoria">${project.categoria}</p>
        <p class="categoria">${project.dificuldade}</p>

        <p id="conteudo">${project.conteudo}</p>
      </article>
      `).join('');

    document.querySelector("#projects").innerHTML = textoHTML;

  }
  catch (error) {
    console.error('Falha ao exibir os projetos:', error);
  }
}
