document.querySelector("#btn1").addEventListener("click", () => carregarItens(6), false);
document.querySelector("#btn2").addEventListener("click", () => carregarItens(7), false);
document.querySelector("#btn3").addEventListener("click", () => carregarItens(8), false);
document.querySelector("#btn4").addEventListener("click", () => carregarItens(9), false);
document.querySelector("#btn5").addEventListener("click", () => carregarItens(10), false);
document.querySelector("#btn6").addEventListener("click", () => carregarItens(11), false);
document.querySelector("#btn7").addEventListener("click", () => carregarItens(5), false);
document.querySelector("#btn8").addEventListener("click", () => carregarItens(4), false);
document.querySelector("#btn9").addEventListener("click", () => carregarItens(3), false);
document.querySelector("#btn10").addEventListener("click", () => carregarItens(1), false);
document.querySelector("#btn11").addEventListener("click", () => carregarItens(0), false);
document.querySelector("#btn12").addEventListener("click", () => carregarItens(2), false);


var modal = document.getElementById("myModal");
var modalImage = document.getElementById('modalImage');
var modalText = document.getElementById('modalText');
var closeBtn = document.getElementById("closeBtn");

function carregarItens(index) {
    fetch('db.json')
        .then(function (response) { return response.json() })
        .then(function (db) {
            let informacoes = db.arduino[index];
            modalImage.src = informacoes.imagem; 

            modalText.innerHTML = `<strong>${informacoes.nome}</strong> | ${informacoes.descricao}`;
            
            modal.style.display = "block";
        })
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function fecharModal() {
    modal.style.display = "none";
}
