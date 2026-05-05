const nome = document.getElementById("nome");
const descricao = document.getElementById("descricao");
const preco = document.getElementById("preco");
const imagem = document.getElementById("imagemProduto");


nome.addEventListener("input", () => {
    document.getElementById("previewTitle").innerText =
        nome.value || "Nome do produto";
});

descricao.addEventListener("input", () => {
    document.getElementById("previewDesc").innerText =
        descricao.value || "Descrição breve do produto...";
});

preco.addEventListener("input", () => {
    let valor = preco.value;

    if (valor) {
        document.getElementById("previewPrice").innerText =
            "R$ " + parseFloat(valor).toFixed(2).replace(".", ",");
    } else {
        document.getElementById("previewPrice").innerText = "R$ 0,00";
    }
});

imagem.addEventListener("change", () => {
    const file = imagem.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById("previewImage").src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});