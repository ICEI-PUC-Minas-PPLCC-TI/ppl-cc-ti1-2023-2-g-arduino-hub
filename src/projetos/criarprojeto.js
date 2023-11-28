function addProjeto(event) {
    event.preventDefault();

    var form = document.getElementById("projeto");
    var title = document.getElementById("titulo").value;
    var category = document.getElementById("categoria").value;
    var image = document.getElementById("imagem").files[0];
    var difficulty = document.getElementById("dificuldade");
    var selectedDifficulty = difficulty.options[difficulty.selectedIndex].value;
    var content = document.getElementById("conteudo").value;

    if (title !== "" && category !== "" && content !== "" && image !== "" && difficulty !== "") {
        var reader = new FileReader();

        reader.onload = function (event) {
            var imageDataUrl = event.target.result;

            var projeto = {
                "titulo": title,
                "categoria": category,
                "conteudo": content,
                "imagem": imageDataUrl,
                "dificuldade": selectedDifficulty
            };

            fetch("https://json-server.arnobio.repl.co", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(projeto)
            })
                .then(function (response) {
                    if (response.ok) {
                        alert('Projeto adicionado');
                        form.reset();
                    } else {
                        console.error('Error:', error);
                        alert('Ocorreu um erro');
                    }
                })
                .catch(function (error) {
                    console.error('Error:', error);
                    alert('Ocorreu um erro. Verifique o console para mais informações.');
                });
        };

        reader.readAsDataURL(image);
    } else {
        alert("Campos inválidos");
    }
}
