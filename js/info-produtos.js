$(function () {
    var db = firebase.firestore();
    var parametroDaUrl = window.location.href.split("?")[1];

    if (parametroDaUrl == undefined || parametroDaUrl == "") {
        produtoNãoCadastrado("Houve uma falha na procura do produto");
    } else {
        db.collection("produtos").doc(parametroDaUrl).get().then(function (tabela) {
            var userId = Object.keys(tabela.data())[0];
            var produtoId = Object.values(tabela.data())[0];
            db.collection("usuarios").doc(userId).get().then(function (dataUser) {
                db.collection("usuarios").doc(userId).collection("produtos").doc(produtoId).get().then(function (dataProduto) {


                    // Construindo a parte que mostra a empresa
                    $("body").append(`
                        <header class="containerEmpresa">
                            <div class="divLogoEmpresa">
                                <img class="logoEmpresa" src="../img/logo.png" alt="">
                            </div>
                            <div class="informacoes">
                                <h1 id="nome" class="nome">nome</h1>
                                <h1 id="telefone" class="outrosText">telefone</h1>
                                <h1 id="email" class="outrosText">email</h1>
                                <h1 id="endereco" class="outrosText">endereco</h1>
                            </div>
                        </header>
                    `)
                    let dadosUser = dataUser.data();
                    $("#nome").text(`${dadosUser.nome}`)
                    $("#telefone").text(`Telefone: ${dadosUser.telefone}`)
                    $("#email").text(`Email: ${dadosUser.email}`)
                    $("#endereco").text(`Endereço: ${dadosUser.endereco}`)
                    $(".lds-css").fadeOut("slow");




                    // Construindo a tabela
                    let tabelaSimples = true;
                    let nomeTabela = Object.keys(dataProduto.data())[0];
                    let estrutura = Object.values(dataProduto.data())[0];
                    let titulos = [];
                    let dados = [];

                    Object.keys(estrutura).forEach(titulo => {
                        titulos.push(titulo);
                    });
                    Object.values(estrutura).forEach(dado => {
                        dados.push(dado);
                        tabelaSimples = (typeof dado) == "object" ? false : true;
                    });
                    $("body").append(`
                        <section id="tabela" class="tabela">
                            <h1 class="titulo">${nomeTabela}</h1>
                            <div id="dados" class="dados">
                            </div>
                        </section>
                    `)
                    if (tabelaSimples) {
                        Object.values(titulos).forEach((chave, i) => {
                            console.log(`            ${chave}: ${dados[i]}`);
                            $("#dados").append(`
                                <span class="chaveValor">
                                    <h2>${chave}: </h2>
                                    <p>${dados[i]}</p>
                                </span>
                            `);
                        });



                    } else {
                        Object.values(dados).forEach((aux, i) => {
                            $("#dados").append(`
                                    <h1 class="tituloSecao">${titulos[i]}</h1>
                                `);
                            Object.keys(aux).forEach(chave => {
                                $("#dados").append(`
                                    <span class="chaveValor">
                                        <h2>${chave}: </h2>
                                        <p>${aux[chave]}</p>
                                    </span>
                                `);
                            });
                        });
                    }

                }).catch(function (error) {
                    produtoNãoCadastrado("Esse produto foi removido do site");
                });
            }).catch(function (error) {
                produtoNãoCadastrado("Esse produto foi removido do site");
            });
        }).catch(function (error) {
            produtoNãoCadastrado("Produto não cadastrado");
        });
    }

    function produtoNãoCadastrado(frase) {
        $("body").css("justifyContent", "center");
        $("body").css("alignItems", "center");
        $("body").css("height", "100vh");
        $("body").css("backgroundColor", "#ddd");
        $("body").append(`
            <section class="erroProduto">
                <div class="informacoes">
                    <h1 id="nome" class="nome">${frase}</h1>
                </div>
                <img class="imgErro" src="../img/noProdut.svg" alt="">
            </section>
        `)
        $(".lds-css").fadeOut("slow");
    }

    function printaTabelaSecao() {

    }
})