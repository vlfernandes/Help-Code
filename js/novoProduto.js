$(function () {
    var db = firebase.firestore();
    var itemAtual = "";
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            coletaTabelas(user.uid);
        } else {
            window.location.href = ("../html/login.html");
        }
    });



    function coletaTabelas(userId) {
        db.collection("usuarios").doc(userId).collection("tabelas").get().then(function (tabelas) {
            tabelas.forEach(tabela => {
                $(`#selectTabelas`).append(`<option value="${Object.keys(tabela.data())}">${Object.keys(tabela.data())}</option>`);
            });


            ////////////////////////////////////////////////////////////////// SELECT ////////////////////////////////////////////////////////////////////////////////////
            $('select').each(function () {
                var $this = $(this),
                    numberOfOptions = $(this).children('option').length;
                if (numberOfOptions <= 1) {
                    $(`#selectTabelas`).append(`<option value="addTable"> --- CRIAR UMA NOVA TABELA --- </option>`);
                    numberOfOptions++;
                }
                $this.addClass('select-hidden');
                $this.wrap('<div class="select"></div>');
                $this.after('<div class="select-styled"></div>');

                var $styledSelect = $this.next('div.select-styled');
                $styledSelect.text($this.children('option').eq(0).text());

                var $list = $('<ul />', {
                    'class': 'select-options'
                }).insertAfter($styledSelect);

                for (var i = 0; i < numberOfOptions; i++) {
                    $('<li />', {
                        text: $this.children('option').eq(i).text(),
                        rel: $this.children('option').eq(i).val(),
                        id: $this.children('option').eq(i).val()
                    }).appendTo($list);
                }

                var $listItems = $list.children('li');

                $styledSelect.click(function (e) {
                    e.stopPropagation();
                    $('div.select-styled.active').not(this).each(function () {
                        $(this).removeClass('active').next('ul.select-options').hide();
                    });
                    $(this).toggleClass('active').next('ul.select-options').toggle();
                });

                $listItems.click(function (e) {
                    e.stopPropagation();
                    $styledSelect.text($(this).text()).removeClass('active');
                    $this.val($(this).attr('rel'));
                    $list.hide();
                    clickNoSelect($this.val(), userId);
                });

                $(document).click(function () {
                    $styledSelect.removeClass('active');
                    $list.hide();
                });
            });
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


            $(".lds-css").fadeOut("slow");
        }).catch(function (error) {
            console.log(error);
        });
    }



    function clickNoSelect(val, userId) {
        if (val == "addTable") {
            window.location.href = ("../html/novaTabela.html");
        } else {
            notificacao(`
                <section class="notificacao">
                    <div id="load"></div>
                </section>
            `);
            setTimeout(() => {
                db.collection("usuarios").doc(userId).collection("tabelas").get().then(function (tabelas) {
                    $("#containerInserirProduto").remove()

                    $("body").append(`
                        <section id="containerInserirProduto" class="containerInserirProduto">
                            <div class="divNomeDoProduto">
                                <h1 class="titleNomeDoProduto">Nome do produto: </h1>
                                <input class="inputNomeDoProduto" type='text' name="nomeDoProduto" id="nomeDoProduto" maxlength="35" required>
                            </div>
                            <span class="addSection" id="addSection">
                                <h2>+ Add Seção</h2>
                            </span>
                        </section>
                    `)
                    $(".notificacao").fadeOut(500)
                    setTimeout(() => {
                        $(".notificacao").remove()
                    }, 500);

                    tabelas.forEach(tabela => {
                        if (Object.keys(tabela.data()) == val) {
                            $("#titleSecao").text(Object.keys(Object.values(tabela.data())[0])[0])
                            Object.keys(Object.values(tabela.data())[0]).forEach((titleSecao, indexSecao) => {
                                $("#containerInserirProduto").append(`
                                    <div class="divSecao">
                                        <span class="titleSecao">
                                            <img class="icon iconSecao" id="exclui${indexSecao}" src="../img/trash.svg" alt="Del">
                                            <h2 id="${indexSecao}">${titleSecao}</h2>
                                            <img class="icon iconSecao" id="edit${indexSecao}" src="../img/edit.svg" alt="Del">
                                        </span>
                                        <span class="addItem" id="addItemSecao${indexSecao}">
                                            <h2>+ Add item</h2>
                                        </span>
                                    </div>
                                `)

                                ///////////////////////// Exclui seção //////////////////////////
                                $("body").on("click", `#exclui${indexSecao}`, function () {
                                    itemAtual = indexSecao;
                                    notificacao(`
                                        <section class="notificacao">
                                            <div class="fundo">
                                                <h2 class="titulo">Deseja excluir a seção  "${$(`#${indexSecao}`).text()}" ?</h2>
                                                <span>
                                                <a id="delFalseExcluir" href="#">NÃO</a>
                                                <a id="delTrueExcluir" href="#">SIM</a>
                                                </span>
                                            </div>
                                        </section>
                                    `);
                                })

                                ///////////////////////// Edita seção //////////////////////////
                                $("body").on("click", `#edit${indexSecao}`, function () {
                                    itemAtual = indexSecao;
                                    notificacao(`
                                        <section class="notificacao">
                                            <div class="fundo edit">
                                                <h2 class="titulo">Alterar a seção  "${$(`#${indexSecao}`).text()}"  para:</h2>
                                                <input type='text' name="nomeDoProduto" id="editando${indexSecao}" maxlength="35" required>
                                                <span>
                                                    <a id="editFalse" href="#">Cancelar</a>
                                                    <a id="editTrue" href="#">Concluir</a>
                                                </span>
                                            </div>
                                        </section>
                                    `);
                                })


                                Object.values(Object.values(tabela.data())[0])[indexSecao].forEach((item, indexItem) => {
                                    $(`#${indexSecao}`).parent().parent().append(`
                                        <div class="divItem">
                                            <span class="spanItem">
                                                <img class="icon" id="excluiItem${indexItem}SECAO${indexSecao}" src="../img/trash.svg" alt="Del">
                                                <h2 class="titleItem" id="${indexItem}SECAO${indexSecao}">${item}</h2>    
                                                <img class="icon" id="editItem${indexItem}SECAO${indexSecao}" src="../img/edit.svg" alt="Del">
                                            </span>                                    
                                            <input class="inputItens" type='text' name="nomeDoItem" id="nomeDoItem" maxlength="35" required>
                                        </div>
                                    `)

                                    ///////////////////////// Exclui Item //////////////////////////
                                    $("body").on("click", `#editItem${indexItem}SECAO${indexSecao}`, function () {
                                        itemAtual = `${indexItem}SECAO${indexSecao}`;
                                        notificacao(`
                                            <section class="notificacao">
                                                <div class="fundo edit">
                                                    <h2 class="titulo">Alterar o item  "${$(`#${indexItem}SECAO${indexSecao}`).text()}"  para:</h2>
                                                    <input type='text' name="nomeDoProduto" id="editando${indexItem}SECAO${indexSecao}" maxlength="35" required>
                                                    <span>
                                                        <a id="editFalse" href="#">Cancelar</a>
                                                        <a id="editTrue" href="#">Concluir</a>
                                                    </span>
                                                </div>
                                            </section>
                                        `);
                                    })

                                    ///////////////////////// Edita item //////////////////////////
                                    $("body").on("click", `#excluiItem${indexItem}SECAO${indexSecao}`, function () {
                                        itemAtual = `${indexItem}SECAO${indexSecao}`;
                                        notificacao(`
                                            <section class="notificacao">
                                                <div class="fundo">
                                                    <h2 class="titulo">Deseja excluir o item  "${$(`#${indexItem}SECAO${indexSecao}`).text()}" ?</h2>
                                                    <span>
                                                    <a id="delFalseExcluir" href="#">NÃO</a>
                                                    <a id="delTrueExcluir" href="#">SIM</a>
                                                    </span>
                                                </div>
                                            </section>
                                        `);
                                    })

                                })
                            });
                        }
                    });
                    window.location.href = '#containerInserirProduto';
                    $(".lds-css").fadeOut("slow");
                }).catch(function (error) {
                    console.log(error);
                });
                console.log("Criar as tabelas dos produtos", val, userId)
            }, 500);
        }
    }

    $("body").on("click", "#editTrue", function (event) {
        event.preventDefault();
        $(`#${itemAtual}`).text($(`#editando${itemAtual}`).val())
        $(".notificacao").fadeOut(500)
        setTimeout(() => {
            $(".notificacao").remove()
        }, 500);
    });

    $("body").on("click", "#delTrueExcluir", function (event) {
        event.preventDefault();
        $(".notificacao").fadeOut(500)
        setTimeout(() => {
            $(".notificacao").remove()
        }, 500);
        $(`#${itemAtual}`).parent().parent().fadeOut(500)
        setTimeout(() => {
            $(`#${itemAtual}`).parent().parent().remove()
        }, 500);

    });

    $("body").on("click", "#delFalseExcluir, #editFalse", function (event) {
        event.preventDefault();
        $(".notificacao").fadeOut(500)
        setTimeout(() => {
            $(".notificacao").remove()
        }, 500);
    });

    function notificacao(text) {
        $("body").append(text).fadeIn(500);
    }
});