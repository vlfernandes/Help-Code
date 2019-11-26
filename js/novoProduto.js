$(function () {
    var db = firebase.firestore();
    var existeImg = false
    var imgs;
    var storage = firebase.storage();
    // storage.ref("usuarios/123456L/logo_empresa/ADV 2.png").getDownloadURL().then(function (url) {
    //     console.log(url);
    // })
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
                                <input class="inputNomeDoProduto" type='text' id="nomeDoProduto" maxlength="35" autocomplete="off" required>
                            </div>
                            <span class="fimPage">
                                <span class="addSection" id="addSection">
                                    <h2>+ Nova Seção</h2>
                                </span>
                                <a id="avançarProduto" class="concluir" href="#">Avançar</a>
                            </span>
                        </section>
                    `)
                    $(".notificacao").fadeOut(500)
                    setTimeout(() => {
                        $(".notificacao").remove()
                    }, 500);

                    tabelas.forEach(tabela => {
                        if (Object.keys(tabela.data()) == val) {
                            // $("#titleSecao").text(Object.keys(Object.values(tabela.data())[0])[0])
                            if (typeof Object.values(tabela.data())[0][0] == "string") {
                                let titleSecao = 'Informações'
                                let indexSecao = 0
                                $("#containerInserirProduto").append(`
                                        <div class="divSecao">
                                            <span class="titleSecao">
                                                <img class="icon iconSecao" id="exclui${indexSecao}" src="../img/trash.svg" alt="Del">
                                                <h2 id="${indexSecao}">${titleSecao}</h2>
                                                <img class="icon iconSecao" id="edit${indexSecao}" src="../img/edit.svg" alt="Del">
                                            </span>
                                            <span class="addItem" id="addItemSecao${indexSecao}">
                                                <h2>+ Novo item</h2>
                                            </span>
                                        </div>
                                    `)
                                ///////////////////////// Exclui eventos //////////////////////////
                                $("body").off("click", `#exclui${indexSecao}`)
                                $("body").off("click", `#edit${indexSecao}`)

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
                                                <input type='text' id="editando${indexSecao}" maxlength="35" required>
                                                <span>
                                                    <a id="editFalse" href="#">Cancelar</a>
                                                    <a id="editTrue" href="#">Concluir</a>
                                                </span>
                                            </div>
                                        </section>
                                    `);
                                })
                                Object.values(Object.values(tabela.data())[0]).forEach((item, indexItem) => {
                                    $(`#${indexSecao}`).parent().parent().append(`
                                        <div class="divItem">
                                            <span class="spanItem">
                                                <img class="icon" id="excluiItem${indexItem}SECAO${indexSecao}" src="../img/trash.svg" alt="Del">
                                                <h2 class="titleItem" id="${indexItem}SECAO${indexSecao}">${item}</h2>    
                                                <img class="icon" id="editItem${indexItem}SECAO${indexSecao}" src="../img/edit.svg" alt="Del">
                                            </span>                                    
                                            <input class="inputItens" type='text' id="itemInput${indexItem}SECAO${indexSecao}" maxlength="35" required>
                                        </div>
                                    `)

                                    ///////////////////////// Exclui eventos //////////////////////////
                                    $("body").off("click", `#editItem${indexItem}SECAO${indexSecao}`)
                                    $("body").off("click", `#excluiItem${indexItem}SECAO${indexSecao}`)

                                    ///////////////////////// Exclui Item //////////////////////////
                                    $("body").on("click", `#editItem${indexItem}SECAO${indexSecao}`, function () {
                                        itemAtual = `${indexItem}SECAO${indexSecao}`;
                                        notificacao(`
                                            <section class="notificacao">
                                                <div class="fundo edit">
                                                    <h2 class="titulo">Alterar o item  "${$(`#${indexItem}SECAO${indexSecao}`).text()}"  para:</h2>
                                                    <input type='text' id="editando${indexItem}SECAO${indexSecao}" maxlength="35" required>
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
                            } else {
                                Object.keys(Object.values(tabela.data())[0]).forEach((titleSecao, indexSecao) => {
                                    $("#containerInserirProduto").append(`
                                        <div class="divSecao">
                                            <span class="titleSecao">
                                                <img class="icon iconSecao" id="exclui${indexSecao}" src="../img/trash.svg" alt="Del">
                                                <h2 id="${indexSecao}">${titleSecao}</h2>
                                                <img class="icon iconSecao" id="edit${indexSecao}" src="../img/edit.svg" alt="Del">
                                            </span>
                                            <span class="addItem" id="addItemSecao${indexSecao}">
                                                <h2>+ Novo item</h2>
                                            </span>
                                        </div>
                                    `)
                                    ///////////////////////// Exclui eventos //////////////////////////
                                    $("body").off("click", `#exclui${indexSecao}`)
                                    $("body").off("click", `#edit${indexSecao}`)

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
                                                <input type='text' id="editando${indexSecao}" maxlength="35" required>
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
                                                    <input class="inputItens" type='text' id="itemInput${indexItem}SECAO${indexSecao}" maxlength="35" required>
                                                </div>
                                            `)

                                        ///////////////////////// Exclui eventos //////////////////////////
                                        $("body").off("click", `#editItem${indexItem}SECAO${indexSecao}`)
                                        $("body").off("click", `#excluiItem${indexItem}SECAO${indexSecao}`)

                                        ///////////////////////// Exclui Item //////////////////////////
                                        $("body").on("click", `#editItem${indexItem}SECAO${indexSecao}`, function () {
                                            itemAtual = `${indexItem}SECAO${indexSecao}`;
                                            notificacao(`
                                                    <section class="notificacao">
                                                        <div class="fundo edit">
                                                            <h2 class="titulo">Alterar o item  "${$(`#${indexItem}SECAO${indexSecao}`).text()}"  para:</h2>
                                                            <input type='text' id="editando${indexItem}SECAO${indexSecao}" maxlength="35" required>
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
                        }
                    });
                    window.location.href = '#containerInserirProduto';
                    $(".lds-css").fadeOut("slow");
                }).catch(function (error) {
                    console.log(error);
                });
                // console.log("Criar as tabelas dos produtos", val, userId)
            }, 500);
        }
    }


    //================================================================================== BOTAO ADICIONAR ITEM =========================================================================================
    $("body").on("click", ".addItem", function () {
        let indexItem = 0;
        let indexSecao = (this.id).split("addItemSecao")[1]
        let index = 0;
        while (true) {
            if (!$(`#${index}SECAO${indexSecao}`).length) {
                indexItem = index;
                break;
            }
            index++;
        }

        $(this).parent().append(`
        <div class="divItem">
            <span class="spanItem">
                <img class="icon" id="excluiItem${indexItem}SECAO${indexSecao}" src="../img/trash.svg" alt="Del">
                <h2 class="titleItem" id="${indexItem}SECAO${indexSecao}"></h2>    
                <img class="icon" id="editItem${indexItem}SECAO${indexSecao}" src="../img/edit.svg" alt="Del">
            </span>                                    
            <input class="inputItens" type='text' id="itemInput${indexItem}SECAO${indexSecao}" maxlength="35" required>
        </div>
        `).fadeIn(500)

        ////////////////////////// Insere valor ///////////////////////
        itemAtual = `${indexItem}SECAO${indexSecao}`;
        notificacao(`
            <section class="notificacao">
                <div class="fundo edit">
                    <h2 class="titulo">O nome do item será:</h2>
                    <input type='text' id="editando${indexItem}SECAO${indexSecao}" maxlength="35" required>
                    <span>
                        <a id="editFalse" href="#">Cancelar</a>
                        <a id="editTrue" href="#">Concluir</a>
                    </span>
                </div>
            </section>
        `);


        ///////////////////////// Exclui eventos //////////////////////////
        $("body").off("click", `#editItem${indexItem}SECAO${indexSecao}`)
        $("body").off("click", `#excluiItem${indexItem}SECAO${indexSecao}`)


        ///////////////////////// Exclui Item //////////////////////////
        $("body").on("click", `#editItem${indexItem}SECAO${indexSecao}`, function () {
            itemAtual = `${indexItem}SECAO${indexSecao}`;
            notificacao(`
                <section class="notificacao">
                    <div class="fundo edit">
                        <h2 class="titulo">Alterar o item  "${$(`#${indexItem}SECAO${indexSecao}`).text()}"  para:</h2>
                        <input type='text' id="editando${indexItem}SECAO${indexSecao}" maxlength="35" required>
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
    //=============================================================================================================================================================================================

    //================================================================================== BOTAO ADICIONAR SEÇÃO =========================================================================================
    $("body").on("click", "#addSection", function () {
        let indexSecao = 0
        let index = 0;
        while (true) {
            if (!$(`#${index}`).length) {
                indexSecao = index;
                break;
            }
            index++;
        }

        $(this).parent().parent().append(`
            <div class="divSecao">
                <span class="titleSecao">
                    <img class="icon iconSecao" id="exclui${indexSecao}" src="../img/trash.svg" alt="Del">
                    <h2 id="${indexSecao}"></h2>
                    <img class="icon iconSecao" id="edit${indexSecao}" src="../img/edit.svg" alt="Del">
                </span>
                <span class="addItem" id="addItemSecao${indexSecao}">
                    <h2>+ Novo item</h2>
                </span>
            </div>
        `).fadeIn(500)

        ////////////////////////// Insere valor ///////////////////////
        itemAtual = indexSecao;
        notificacao(`
                <section class="notificacao">
                    <div class="fundo edit">
                        <h2 class="titulo">O nome da seção será:</h2>
                        <input type='text' id="editando${indexSecao}" maxlength="35" required>
                        <span>
                            <a id="editFalse" href="#">Cancelar</a>
                            <a id="editTrue" href="#">Concluir</a>
                        </span>
                    </div>
                </section>
            `);


        ///////////////////////// Exclui eventos //////////////////////////
        $("body").off("click", `#exclui${indexSecao}`)
        $("body").off("click", `#edit${indexSecao}`)

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
                        <input type='text' id="editando${indexSecao}" maxlength="35" required>
                        <span>
                            <a id="editFalse" href="#">Cancelar</a>
                            <a id="editTrue" href="#">Concluir</a>
                        </span>
                    </div>
                </section>
            `);
        })
    })
    //=============================================================================================================================================================================================


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

    $("body").on("click", "#delFalseExcluir, #editFalse, #ok", function (event) {
        event.preventDefault();
        $(".notificacao").fadeOut(500)
        setTimeout(() => {
            $(".notificacao").remove()
        }, 500);
    });

    function notificacao(text) {
        $("body").append(text).fadeIn(500);
    }











    $("body").on("click", "#avançarProduto", function (event) {
        event.preventDefault();
        notificacao(`
            <section class="notificacao">
                <div id="load"></div>
            </section>
        `);
        coletarInformacoes();
        // notificacao(`
        //     <section class="notificacao">

        //     </section>
        // `);
    });

    function coletarInformacoes() {
        let valido = true;
        //Validação do nome do produto
        if ($(".inputNomeDoProduto").val() == "") {
            $("html, body").animate({
                scrollTop: parseInt($(".inputNomeDoProduto").offset().top) - 250
            }, 500);
            $(".notificacao div").remove()
            $(".notificacao").append(`
                <div class="fundo edit">
                    <h2 class="titulo">Dê um nome para seu produto</h2>
                    <span style="margin-top:3Rem">
                        <a id="ok" href="#">OK</a>
                    </span>
                </div>
            `);
            valido = false
            return false;
        } else {
            let nomeDoProduto = $(".inputNomeDoProduto").val();
            let secoes = {
                id: [],
                nome: []
            };
            let itens = {
                chave: [],
                valor: [],
                secao: []
            }

            $(".divSecao").each(function () {
                if (!valido) {
                    return
                }
                //Validação do nome da seção
                if ($(this).find(".titleSecao h2").text() == "") {
                    $("html, body").animate({
                        scrollTop: parseInt($(this).find(".titleSecao h2").offset().top) - 250
                    }, 500);
                    $(".notificacao div").remove()
                    $(".notificacao").append(`
                    <div class="fundo edit">
                        <h2 class="titulo">Dê um nome para essa seção</h2>
                        <span style="margin-top:3Rem">
                            <a id="ok" href="#">OK</a>
                        </span>
                    </div>
                `);
                    valido = false
                    console.log("Entrou na secao")
                    return false;
                } else {
                    let id = $(this).find(".titleSecao h2").attr('id')
                    secoes.id.push(id)
                    secoes.nome.push($(this).find(".titleSecao h2").text())
                    $(this).find(".divItem").each(function () {
                        //Validação dos itens
                        if ($(this).find(".spanItem h2").text() == "") {
                            $("html, body").animate({
                                scrollTop: parseInt($(this).find(".spanItem h2").offset().top) - 250
                            }, 500);
                            $(".notificacao div").remove()
                            $(".notificacao").append(`
                                <div class="fundo edit">
                                    <h2 class="titulo">Dê um nome para essa propriedade</h2>
                                    <span style="margin-top:3Rem">
                                        <a id="ok" href="#">OK</a>
                                    </span>
                                </div>
                            `);
                            valido = false
                            console.log("Entrou na propriedade")
                            return false;
                        } else if ($(this).find("input").val() == "") {
                            $("html, body").animate({
                                scrollTop: parseInt($(this).find("input").offset().top) - 250
                            }, 500);
                            $(".notificacao div").remove()
                            $(".notificacao").append(`
                                <div class="fundo edit">
                                    <h2 class="titulo">Descreva essa propriedade</h2>
                                    <span style="margin-top:3Rem">
                                        <a id="ok" href="#">OK</a>
                                    </span>
                                </div>
                            `);
                            valido = false
                            console.log("Entrou na descrição")
                            return false;
                        } else {


                            itens.chave.push($(this).find(".spanItem h2").text())
                            itens.valor.push($(this).find("input").val())
                            itens.secao.push(id)
                        }
                    })
                }
            })
            if (valido) {
                informacoesProduto = montaProduto(nomeDoProduto, secoes, itens)
                console.log(informacoesProduto.nomeDoProduto)
                console.log(informacoesProduto.produto)
                insereImagens();
                $("body").off("click", `#inserirImg`)
                $("body").on("click", "#inserirImg", function () {
                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {
                            escreverProduto(user.uid, informacoesProduto.nomeDoProduto, informacoesProduto.produto);
                        }
                    });
                })
            } else {
                return;
            }
        }
    }

    function montaProduto(nomeDoProduto, secoes, itens) {
        let propriedades
        let produto = {}
        secoes.id.forEach((numeroSecao, i) => {
            propriedades = {}
            for (let index = 0; index < itens.secao.length; index++) {
                if (numeroSecao == itens.secao[index]) {
                    propriedades[itens.chave[index]] = itens.valor[index]
                }
            }
            produto[secoes.nome[i]] = propriedades
        });
        return {
            nomeDoProduto,
            produto
        }
    }

    function insereImagens() {
        $(".notificacao div").remove()
        $(".notificacao").append(`
            <div class="fundo edit">
                <label for="imagem_logo" class="inserirImg" href="#">Selecione algumas imagens do produto</label>
                <input type="file" accept="image/*" class="imagem_logo" id="imagem_logo" multiple>
                <h2 class="numImg">Nenhuma imagem selecionada</h2>
                <span>
                    <a id="inserirImg" href="#">CONTINUAR</a>
                </span>
            </div>
        `)
    }


    $(document).on('change', "#imagem_logo", function () {
        var logo = $("#imagem_logo").prop("files");
        if (logo.length === 0) {
            /* NÂO ESCOLHEU NENHUMA IMAGEM */
        } else {
            for (let i = 0; i < logo.length; i++) {
                if (!validarTipoArquivo(logo[i])) {
                    console.log("invalido")
                    $(".numImg").text("Nenhuma imagem selecionada");
                    existeImg = false;
                    return
                }
            }
            console.log(logo)
            existeImg = true;
            $(".numImg").text("Numero de imagens selecionadas: " + logo.length);
            // $(".slogan").attr("src", window.URL.createObjectURL(logo[0]));
            imgs = logo;
        }
    });

    var tiposDeArquivos = [
        'image/jpeg',
        'image/pjpeg',
        'image/png'
    ]

    function validarTipoArquivo(arquivo) {
        for (var i = 0; i < tiposDeArquivos.length; i++) {
            if (arquivo.type === tiposDeArquivos[i]) {
                return true;
            }
        }
        return false;
    }

    function escreverProduto(userId, nomeDoProduto, produto) {
        $(".notificacao div").remove()
        $(".notificacao").append(`
            <div id="load"></div>
        `)
        setTimeout(() => {
            db.collection("usuarios").doc(userId).collection("produtos").add({
                [nomeDoProduto]: produto
            }).then(function ({
                id
            }) {
                db.collection("produtos").add({
                    [userId]: id
                }).then(function (aux) {
                    if (existeImg) {
                        var storageRef = storage.ref();
                        for (let i = 0; i < imgs.length; i++) {
                            console.log(imgs[i])
                            if (i == imgs.length - 1) {
                                storageRef.child('usuarios/' + userId + '/produtos/' + id + '/' + i).put(imgs[i]).then(function () {
                                    geraQRCode(aux.id)
                                });
                            } else {
                                storageRef.child('usuarios/' + userId + '/produtos/' + id + '/' + i).put(imgs[i]).then(function () {});
                            }
                        }
                    } else {
                        geraQRCode(aux.id)
                    }
                }).catch(function (error) {
                    console.error("nao cadastrou ", error);
                });
            }).catch(function (error) {
                console.error(error);
                $(".notificacao").fadeOut(500)
                setTimeout(() => {
                    $(".notificacao").remove()
                }, 500);
            });
        }, 500);
    }

    function geraQRCode(codProduto) {
        $(".notificacao div").remove()
        $(".notificacao").append(`
            <div class="fundo edit">
                <h2 class="titulo">Produto cadastrado com sucesso.</h2>
                <div class="containerqrCode">
                    <div class="divqrCode">
                        <div id="qrCode"></div>
                    </div>
                    <a id="baixarqrCode" class="baixarqrCode" href="#">Baixe o QR Code</a>
                </div>
                <span style="margin-top:3Rem">
                    <a id="finalizar" href="#">CONCLUIR</a>
                </span>
            </div>
        `)
        urlProduto = `https://help-code.firebaseapp.com/html/info-produtos.html?${codProduto}`
        var qrcode = new QRCode("qrCode", {
            text: urlProduto,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    $("body").on("click", "#finalizar", function () {
        window.location.href = ("../html/produtos.html");
    })

    $("body").on("click", "#baixarqrCode", function () {
        var conteudo = document.getElementById('qrCode').innerHTML;
        tela_impressao = window.open('about:blank');

        tela_impressao.document.write(conteudo);
        tela_impressao.window.print();
        tela_impressao.window.close();
    })
});