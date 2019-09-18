$(function () {
    let idSecao = 1;
    let idItem = 1;

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
            $("#tipoTabela").remove();
        }
    });

    $("body").on("click", "#tipoTabela a", function () {
        $("#formTabela").remove();
        idSecao = 1;
        idItem = 1;
        if ($(this).text() == "Dividido por seções") {
            $("body").append(`
            <form autocomplete="off" id="formTabela" class="formTabela">
                <div>
                    <h1>Nome da tabela: </h1>
                    <input class="nomeTabela" type='text' name='nomeTabela' id='nomeTabela'>
                </div>
                <span class="conteudo">
                    <ul id="secao">
                        <li id="addSecao">+ Nova seção</li>

                    </ul>
                </span>
            </form>`);
        } else if ($(this).text() == "Simples") {
            $("body").append(`
            <form autocomplete="off" id="formTabela" class="formTabela">
                <div>
                    <h1>Nome da tabela: </h1>
                    <input class="nomeTabela" type='text' name='nomeTabela' id='nomeTabela'>
                </div>
                <span class="conteudo">
                    <ul id="item">
                        <li class="addItem">+ Novo item</li>

                    </ul>
                </span>
            </form>`);
        }
    });

    /* /////////////////////////// Adicionando nova seção ///////////////////////////////// */
    $("body").on("click", "#addSecao", function () {
        $("#secao").append(`
        <li>
            <div>
                <input type='text' name="${idSecao}" id="${idSecao}">
                <img id="excluirInput" src="../img/trash.svg" alt="Del">
            </div>
            <ul id='item'>
                <li class='addItem'>+ Novo item</li>
            </ul>
        </li>`).children(':last').hide().fadeIn(500);
        idSecao++;
    });

    /* /////////////////////////// Adicionando novo item ///////////////////////////////// */
    $("body").on("click", ".addItem", function () {
        $(this).parent().append(`
        <li>
            <div>
                <input type='text' name="${idItem}" id="${idItem}">
                <img id="excluirInput" src="../img/trash.svg" alt="Del">
            </div>
        </li>`).children(':last').hide().fadeIn(500);
        idItem++;
    });

    /* /////////////////////////// Exclui os inputs ///////////////////////////////// */
    $("body").on("click", "#excluirInput", function () {
        $(this).parent().parent().fadeOut(200, function () {
            $(this).remove();
        });
    });
});