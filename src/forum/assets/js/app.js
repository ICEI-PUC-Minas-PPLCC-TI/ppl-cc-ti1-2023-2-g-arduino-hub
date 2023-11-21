const apiUrl = 'https://jsonserver.joao-paulopa392.repl.co/forum';

window.addEventListener('load', readPosts, false)

btnExcluir = document.getElementById('excluir');
btnExcluir.addEventListener('click', deletePosts, false)

function displayMessage(mensagem) {
	msg = document.getElementById('msg');
	msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

function createContato(forum) {
	fetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(forum),
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
			let textoHTML = ''
			for (i=0; i < db.length; i++) {
				let post = db[i]

				textoHTML +=
				`
				<article>
					<h4 id="titulo">${post.titulo} 

					<span id="categoria">${post.categoria} 
						<h4 class="quantidade"> ${post.curtida} 
						</h4> <img class="foto" id="curtida" src="assets/img/gostar.png" 
						alt="Curtida" width="35px" height="35px" onclick="ContarCurtida(${post.id})"> 
					</span>
					
					</h4>

					<a href="DetalhesForum.html?id=${post.id}">
					<p id="descricao">${post.conteudo}</p>
					<p id="id2"> id = ${post.id}</p>
					</a>
				</article>
				`
			}
			document.getElementById('posts').innerHTML = textoHTML
		})
}

function ContarCurtida(){
	fetch(apiUrl)
		.then(function (response) { return response.json() })
		.then(function(db) {
		for(i = 0; db.length; i++)
		{
			let post = db[i]

			let titulo = post.titulo
			let categoria = post.categoria
			let conteudo = post.conteudo
			let somacurtida = parseInt(post.curtida) + 1
			let id = db[i].id

			atualizarCurtida(titulo, categoria, conteudo, somacurtida,id);
		}
		})
}

function atualizarCurtida(titulo, categoria, conteudo, somacurtida,Campoid){

	let curtidaAtualizar = {
		titulo: titulo,
		categoria : categoria,
		conteudo: conteudo,
		curtida: somacurtida
	}

	fetch(`${apiUrl}/${Campoid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(curtidaAtualizar),
    })

	readPosts();
}

function deletePosts(){
	let id = document.getElementById('id').value;
	
	fetch(`${apiUrl}/${id}`, {
		method: 'DELETE',
	})

	readPosts();
}