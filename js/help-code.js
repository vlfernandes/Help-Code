$(function () {
    let typeUser = 1;
    if (typeUser == 1) {
        $("#page #conteudo div p").text("Como é sua primeira vez no site, é necessario configurar sua primeira tabela.");
        $("#page #conteudo img").attr("src", "../img/addTable.png");
        $("#page #conteudo div a").attr("href", "./novaTabela.html");
        $("#page #conteudo div a").text("Configurar");
    } else if (typeUser == 2) {
        $("#page #conteudo div p").text("Cadastre seu primeiro produto");
        $("#page #conteudo img").attr("src", "../img/registrarProdutos.png");
        $("#page #conteudo div a").attr("href", "./novoProduto.html");
        $("#page #conteudo div a").text("Cadastrar");
    }
})