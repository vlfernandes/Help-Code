$(function () {
    var db = firebase.firestore();
    let idSecao = 1;
    let idItem = 1;

    let carro = [
        ["Mecânica", "Motor", "Combustivel", "Potencia", "Torque", "Cambio", "Tração", "Direção"],
        ["Dimensões", "Tanque", "Porta-malas(L)", "Ocupantes"],
        ["Segurança", 'Airbags motorista', 'Airbags lateral', 'Airbags passageiro', "Alarmes", "Freios"],
        ["Conforto", 'Ar-condicionado', 'Travas eletricas', 'Piloto automatico', "Volante com regulagem", "Vidros elétricos", "Teto solar", "Banco de couro"]
    ]

    let moto = [
        ["Mecânica", "Sistema de partida", "Pneu dianteiro", "Pneu traseiro"],
        ["Dimensões", "Peso", "Tanque"]
    ]

    let bicicleta = ["Quadro", "Marca", "Suspensão", "Pneu", "Roda", "Pedal", "Peso"]

    let computador = [
        ["Caracteristicas", "Placa de video", "Drive Optico", "Wireless", "Peso"],
        ["Memoria", "RAM", "ROM"],
        ["Entradas", "USB", "HDMI", "VGA", "Fone/Microfone"]
    ]

    let imovel = [
        ["Interno", "Quantidade de quartos", "Quantidade de suíte", "Quantidade de banheiros", "Quantidade de cozinhas", "Quantidade de salas"],
        ["Externo", "Garagem", "Piscina", "Área gourmet", "Edícula"]
    ]

    let monitorEtv = ["Tamanho da tela", "Tipo da tela", "Marca", "Resolução", "Smart"]

    let celular = [
        ["Rede", "Quantidade de chip", "Tipo de chip"],
        ["Dados tecnicos", "Processador", "Memoria RAM", "Sistema operacional", "Versão do sistema operacional"],
        ["Tela", "Polegadas", "Resolução"],
        ["Camera", "Resolução da camera traseira", "Resolução da camera frontal", "Zoom traseiro", "Zoom frontal", "Flash traseiro", "Flash frontal", "Formato da imagem"],
        ["Video", "Resolução de gravação", "Auto focagem de video", "Video camera frontal"],
        ["Conectividade", "Wi-fi", "bluetooth", "USB", "GPS", "NFC"],
        ["Sensores", "Impressão digital", "Acelerometro", "Proximidade", "Giroscopio", "Búsula", "Mic. resução de ruido"],
        ["Radia FM", "TV", "Vibração", "Viva voz"]
    ]

    $("#tabelasModelos").on("click", "a", function () {
        $("#formTabela").remove();
        $("#tipoTabela").remove();
        idSecao = 1;
        idItem = 1;
        if ($(this).text() == "Customizar") {
            $("body").append(`
            <section class="tipoTabela" id="tipoTabela">    
                <div id="conteudo" class="conteudo">
                    <h1>Escolha o estilo de tabela</h1>
                    <div>
                        <div>
                            <img src="../img/tabelaSimples.png" alt="Tabelas simples">
                            <a href="#formTabela">Simples</a>
                        </div>
                        <div>
                            <img src="../img/tabelaSecao.png" alt="Tabela dividida por seção">
                            <a href="#formTabela">Dividido por seções</a>
                        </div>
                    </div>
                </div>
            </section>`);
        } else {
            switch ($(this).text()) {
                case "Carro":
                    adicionarTabelaModeloSecao(carro);
                    alterarNomeDaTabela("Carro");
                    break;
                case "Moto":
                    adicionarTabelaModeloSecao(moto);
                    alterarNomeDaTabela("Moto");
                    break;
                case "Bicicleta":
                    adicionarTabelaModeloItem(bicicleta);
                    alterarNomeDaTabela("Bicicleta");
                    break;
                case "Computador":
                    adicionarTabelaModeloSecao(computador);
                    alterarNomeDaTabela("Computador");
                    break;
                case "Imóvel":
                    adicionarTabelaModeloSecao(imovel);
                    alterarNomeDaTabela("Imóvel");
                    break;
                case "Monitor\\TV":
                    adicionarTabelaModeloItem(monitorEtv);
                    alterarNomeDaTabela("Monitor\\TV");
                    break;
                case "Celular":
                    adicionarTabelaModeloSecao(celular);
                    alterarNomeDaTabela("Celular");
                    break;
                default:
                    break;
            }
        }
    });

    /* /////////////////////////// Escolhe o tipo de tabela ///////////////////////////////// */
    $("body").on("click", "#tipoTabela a", function () {
        $("#formTabela").remove();
        idSecao = 1;
        idItem = 1;
        if ($(this).text() == "Dividido por seções") {
            adicionarTabelaSecao();
        } else if ($(this).text() == "Simples") {
            adicionarTabelaSimples();
        }
    });

    /* /////////////////////////// Adicionando nova seção ///////////////////////////////// */
    $("body").on("click", "#addSecao", function () {
        adicionarSecao("");
    });

    /* /////////////////////////// Adicionando novo item ///////////////////////////////// */
    $("body").on("click", ".addItem", function () {
        adicionarItem("", this);
    });

    /* /////////////////////////// Exclui os inputs ///////////////////////////////// */
    $("body").on("click", "#excluirInput", function () {
        $(this).parent().parent().fadeOut(200, function () {
            $(this).remove();
        });
    });

    /* /////////////////////////// Faz a inserção ///////////////////////////////// */
    $("body").on("click", "#concluir", function (event) {
        notificacao(`
            <section id="notificacao" class="notificacao">
                <div id="load"></div>
            </section>
        `);
        var nomeTabela = colherNomeTabela();
        var tabelaExiste = false;


        firebase.auth().onAuthStateChanged(function (user) {
            event.preventDefault();
            db.collection("usuarios").doc(user.uid).collection("tabelas").get().then(function (tabelas) {
                tabelas.forEach(tabela => {
                    if (Object.keys(tabela.data())[0] == nomeTabela) {
                        tabelaExiste = true;
                    }
                });
                if (!tabelaExiste) {
                    if (nomeTabela != -1) {
                        var secoes = colherSecao();
                        if (secoes != -1) {
                            var tabela = colherItens(secoes);
                            if (tabela != -1) {
                                $("#notificacao").append(`
                                <div id="bloco" class="bloco escondido">
                                    <h2 class="titulo">Gravado com sucesso.</h2>
                                    <span>
                                        <a id="okSucess" href="#">Ok</a>
                                    </span>
                                </div>
                                `)
                                escreverTabela(user.uid, nomeTabela, tabela);
                            } else {
                                $("#load").addClass("escondido");
                                $("#notificacao").append(`
                                    <div class="bloco">
                                        <h2 class="titulo">Algum item ficou vazio, de um nome para ele.</h2>
                                        <span>
                                            <a id="okNotificacao" href="#">Ok</a>
                                        </span>
                                    </div>
                                `);
                            }
                        } else {
                            $("#load").addClass("escondido");
                            $("#notificacao").append(`
                                <div class="bloco">
                                    <h2 class="titulo">Alguma seção ficou vazia, de um nome para ela.</h2>
                                    <span>
                                        <a id="okNotificacao" href="#">Ok</a>
                                    </span>
                                </div>
                            `);
                        }
                    } else {
                        $("#load").addClass("escondido");
                        $("#notificacao").append(`
                            <div class="bloco">
                                <h2 class="titulo">Defina um nome para a tabela.</h2>
                                <span>
                                    <a id="okNotificacao" href="#">OK</a>
                                </span>
                            </div>
                        `);
                    }
                } else {
                    $("#load").addClass("escondido");
                    $("#notificacao").append(`
                        <div class="bloco">
                            <h2 class="titulo">Tabela ja cadastrada, altere o nome para continuar.</h2>
                            <span>
                                <a id="okNotificacao" href="#">Alterar nome</a>
                            </span>
                        </div>
                    `);
                    $("html, body").animate({
                        scrollTop: parseInt($('input[type=text]#nomeTabela').offset().top) - 250
                    }, 500);
                }
            }).catch(function (error) {
                console.log(error);
            });
        });
    });

    $("body").on("click", "#okNotificacao", function (event) {
        event.preventDefault();
        $(".notificacao").fadeOut(500).remove()
    });

    $("body").on("click", "#okSucess", function (event) {
        event.preventDefault();
        $(".notificacao").fadeOut(500).remove();
        window.location.href = ("../html/tabelas.html");
    });






    /* ///////////////////////////////////////////////////////////// TODAS AS FUNÇÔES BASICAS ////////////////////////////////////////////////////////////////// */
    function adicionarSecao(texto) {
        $("#secao").append(`
        <li id="parteSecao">
            <div id="inputForm">
                <input type='text' name="Secao${idSecao}" id="Secao${idSecao}" value="${texto}" maxlength="35" required>
                <img id="excluirInput" src="../img/trash.svg" alt="Del">
            </div>
            <ul id='item'>
                <li class='addItem'>+ Novo item</li>
            </ul>
        </li>`).children(':last').hide().fadeIn(500);
        idSecao++;
    }

    function adicionarItem(texto, secao) {
        $(secao).parent().append(`
        <li id="parteItem">
            <div>
                <input type='text' name="Item${idItem}" id="Item${idItem}" value="${texto}" maxlength="35" required>
                <img id="excluirInput" src="../img/trash.svg" alt="Del">
            </div>
        </li>`).children(':last').hide().fadeIn(500);
        idItem++;
    }

    function adicionarTabelaSimples() {
        $("body").append(`
        <form autocomplete="off" id="formTabela" class="formTabela">
            <div class="fundoDoFormulario">
                <div>
                    <h1>Nome da tabela: </h1>
                    <input class="nomeTabela" type='text' name='nomeTabela' id='nomeTabela' maxlength="20">
                </div>
                <span class="conteudo estiloDeTabelaItem">
                    <ul id="item">
                        <li class="addItem">+ Novo item</li>
                    </ul>
                </span>
                <a id="concluir" class="concluir" href="#">Concluir</a>
            </div>
        </form>`);
    }

    function adicionarTabelaSecao() {
        $("body").append(`
        <form autocomplete="off" id="formTabela" class="formTabela">
            <div class="fundoDoFormulario">
                <div>
                    <h1>Nome da tabela: </h1>
                    <input class="nomeTabela" type='text' name='nomeTabela' id='nomeTabela' maxlength="20">
                </div>
                <span class="conteudo">
                    <ul id="secao">
                        <li id="addSecao">+ Nova seção</li>
                    </ul>
                </span>
                <a id="concluir" class="concluir" href="#">Concluir</a>
            </div>
        </form>`);
    }

    function adicionarTabelaModeloSecao(objeto) {
        adicionarTabelaSecao();
        let ordem = 2;
        for (let i = 0; i < objeto.length; i++) {
            adicionarSecao(objeto[i][0]);
        }

        for (let i = 0; i < objeto.length; i++) {
            for (let j = 1; j < objeto[i].length; j++) {
                adicionarItem(objeto[i][j], (`li:nth-of-type(${ordem}) .addItem`));
            }
            ordem++;
        }
    }

    function adicionarTabelaModeloItem(objeto) {
        adicionarTabelaSimples();
        for (let i = 0; i < objeto.length; i++) {
            adicionarItem(objeto[i], (`.addItem`));
        }
    }

    function alterarNomeDaTabela(nome) {
        $('input[type=text]#nomeTabela').val(nome);
    }

    function escreverTabela(userId, nomeTabela, tabela) {
        setTimeout(() => {
            db.collection("usuarios").doc(userId).collection("tabelas").doc().set({
                [nomeTabela]: tabela
            }).then(function () {
                $("#bloco").removeClass("escondido");
                $("#load").addClass("escondido");
            }).catch(function (error) {
                console.error("Error writing document: ", error);
            });
        }, 750);
    }

    function colherNomeTabela() {
        if ($('input[type=text]#nomeTabela').val() == "") {
            $("html, body").animate({
                scrollTop: parseInt($('input[type=text]#nomeTabela').offset().top) - 250
            }, 500);
            return -1;
        } else {
            return $('input[type=text]#nomeTabela').val();
        }
    }

    function colherSecao() {
        let secoes = [];
        let validacao = true;
        $("form div span ul#secao li#parteSecao").each(function () {
            if ($(this).find("div#inputForm input").val() == "") {
                // $(this).find("div#inputForm input").addClass("erro");
                $("html, body").animate({
                    scrollTop: parseInt($(this).find("div#inputForm input").offset().top) - 250
                }, 500);
                validacao = false;
                return;
            } else {
                secoes.push($(this).find("div#inputForm input").attr('id'));
            }
        });
        if (validacao) {
            return secoes;
        } else {
            return -1;
        }
    }

    function colherItens(secoes) {
        let tabela;
        let validacao = true;
        if (secoes.length === 0) {
            tabela = [];
            $("form div span ul#item li#parteItem").each(function () {
                tabela.push($(this).find("div input").val());
            });
        } else {
            tabela = new Object;
            let itens = [];
            secoes.forEach((secaoAtual) => {
                if (!validacao) {
                    return;
                }
                $(`#${secaoAtual}`).parent().parent().find("ul li#parteItem").each(function () {
                    if ($(this).find("div input").val() == "") {
                        // $(this).find("div input").addClass("erro");
                        $("html, body").animate({
                            scrollTop: parseInt($(this).find("div input").offset().top) - 250
                        }, 500);
                        validacao = false;
                        return;
                    } else {
                        itens.push($(this).find("div input").val());
                    }
                });
                s = $(`#${secaoAtual}`).val();
                tabela[s] = itens;
                itens = [];
            });
        }
        if (validacao) {
            return tabela;
        } else {
            return -1;
        }
    }

    function notificacao(text) {
        $("body").append(text).fadeIn(500);
    }
});