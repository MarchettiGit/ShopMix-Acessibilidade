
    const nome = document.getElementById("nomeProduto");
    const descricao = document.getElementById("descricaoProduto");
    const preco = document.getElementById("precoProduto");
    const imagem = document.getElementById("imagemProduto");

    // Atualiza título
    nome.addEventListener("input", () => {
    document.getElementById("previewTitle").innerText =
        nome.value || "Nome do produto";
});

    // Atualiza descrição
    descricao.addEventListener("input", () => {
    document.getElementById("previewDesc").innerText =
        descricao.value || "Descrição breve do produto...";
});

    // Atualiza preço
    preco.addEventListener("input", () => {
    let valor = preco.value;

    if (valor) {
    document.getElementById("previewPrice").innerText =
    "R$ " + parseFloat(valor).toFixed(2).replace(".", ",");
} else {
    document.getElementById("previewPrice").innerText = "R$ 0,00";
}
});

    // Atualiza imagem
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
