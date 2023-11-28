document.addEventListener("DOMContentLoaded", function () {
    mostrarProjetos();
  });

  function mostrarProjetos() {
    fetch('https://jsonserver.arnobio.repl.co/projetos')
      .then(function (response) { return response.json() })
      .then(function (projetos) {
        let projetosHTML = '';
  
        projetos.forEach(function (projeto) {
          projetosHTML += `
            <div class="col-md-3">
              <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
                <img src="${projeto.imagem}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${projeto.titulo}</h5>
                  <p class="card-text">Categoria: ${projeto.categoria} | Nível de dificuldade: ${projeto.dificuldade}</p>
                  <p class="card-content">${projeto.conteudo}</p>
                  <a href="#?title=${encodeURIComponent(projeto.titulo)}">Ver Detalhes</a>
                </div>
              </div>
            </div>`;
        });
  
        const projetosContainer = document.getElementById('projetos');
        projetosContainer.innerHTML = `<div class="row">${projetosHTML}</div>`;
      });
  }
  