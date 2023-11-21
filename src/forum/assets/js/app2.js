const apiUrl = 'https://jsonserver.joao-paulopa392.repl.co/postdetalhado';

window.addEventListener('load', readPosts, false)
window.addEventListener('load', readPosts2, false)

function createComentario(detalhesForum) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(detalhesForum),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Contato inserido com sucesso");
        })
        .catch(error => {
            console.error('Erro ao inserir contato via API JSONServer:', error);
            displayMessage("Erro ao inserir contato");
        });

}

function readPosts() {
	fetch(apiUrl)
		.then(function (response) { return response.json() })
		.then(function(db) {

            let parametros = new URLSearchParams(location.search)
            let id = parametros.get('id')

			let textoHTML = ''

			for (i=0; i < db.length; i++) {
				let post = db[i]
				
                if(db[i].auxiliar == id)
                {
                    textoHTML += `
                    <h4>${post.usuario}<h4>
                    <h4>${post.comentario}</h4>
                    <br><br>
                    `
                }
			}
			document.getElementById('exibir_comentario').innerHTML = textoHTML
		})
}

