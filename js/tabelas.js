$(function () {
    var db = firebase.firestore();
    var tabelaAtual = "";

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            procurarTabelas(user.uid)
        } else {
            window.location.href = ("../html/login.html");
            // $(".lds-css").fadeOut("slow");
        }
    });

    $(".addTabela").click(function () {
        window.location.href = ("../html/novaTabela.html");
    });

    $("body").on("click", "a", function () {
        if ($(this).text() == "Excluir") {
            tabelaAtual = $(this).parent().parent().parent().find("h2");

            notificacao(`
                    <section class="notificacao">
                        <div class="delete">
                            <h2 class="titulo">Deseja excluir a tabela ${tabelaAtual.text()}?</h2>
                            <span>
                            <a id="delFalseExcluir" href="#">NÃO</a>
                            <a id="delTrueExcluir" href="#">SIM</a>
                            </span>
                        </div>
                    </section>
                `);
        } else if ($(this).text() == "Editar") {
            notificacao(`
                <section class="notificacao">
                    <div id="load"></div>
                </section>
            `);
            coletaDadosTabela($(this))

        } else if ($(this).text() == "Vizualizar") {
            notificacao(`
                <section class="notificacao">
                    <div id="load"></div>
                </section>
            `);

            coletaDadosTabela($(this))
        }
    });

    $("body").on("click", "#delTrueExcluir", function () {
        $(".notificacao div").remove();
        $(".notificacao").append(`
            <div id="load"></div>
        `);
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                deletarTabela(tabelaAtual.text(), user.uid, tabelaAtual.parent())
            }
        });
    });

    $("body").on("click", "#delFalseExcluir, #closeView", function () {
        $(".notificacao").fadeOut(500)
        setTimeout(() => {
            $(".notificacao").remove()
        }, 500);
    });

    function procurarTabelas(userId) {
        db.collection("usuarios").doc(userId).collection("tabelas").get().then(function (tabelas) {
            tabelas.forEach(tabela => {
                // console.log(typeof (Object.values(tabela.data())[0])[1]); //Usar para diferenciar o array do Objeto
                $(` <div id="tabelas" class="tabela">
                        <h2>${Object.keys(tabela.data())}</h2>
                        <div>
                            <span>
                                <img id="delete${tabela.id}" src="../img/trash.svg" alt="">
                                <a href="#">Excluir</a>
                            </span>
                            <span>
                                <img id="edit${tabela.id}" src="../img/edit.svg" alt="">
                                <a href="#">Editar</a>
                            </span>
                            <span>
                                <img id="view${tabela.id}" src="../img/visualizar.svg" alt="">
                                <a href="#">Vizualizar</a>
                            </span>
                        </div>
                    </div>`).insertBefore(".addTabela");
            });
            $(".lds-css").fadeOut("slow");
        }).catch(function (error) {
            console.log(error);
        });
    }

    function coletaDadosTabela(instancia) {
        let table
        if (instancia.text() == "Editar") {
            table = instancia.parent().find("img").attr("id").split("edit")[1]
        } else if (instancia.text() == "Vizualizar") {
            table = instancia.parent().find("img").attr("id").split("view")[1]
        }

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                db.collection("usuarios").doc(user.uid).collection("tabelas").get().then(function (tabelas) {
                    tabelas.forEach(tabela => {
                        if (tabela.id == table) {
                            console.log("énois")
                            setTimeout(() => {
                                if (instancia.text() == "Editar") {
                                    editarTabela(tabela.data(), tabela.id)
                                } else if (instancia.text() == "Vizualizar") {
                                    vizualizarTabela(tabela.data())
                                }
                            }, 500);
                        }
                    });

                }).catch(function (error) {
                    console.log(error);
                });
            }
        });
    }

    function vizualizarTabela(tabela) {
        $(".notificacao").remove();
        notificacao(`
            <section class="notificacao sobrePage">
                <div class="containerView">
                    <a id="closeView" href="#">X</a>
                    <h2 class="titulo">${Object.keys(tabela)[0]}</h2>
                </div>
            </section>
        `);
        if (typeof Object.values(tabela)[0][0] == "string") {
            Object.values(tabela)[0].forEach(value => {
                $(".containerView").append(`
                    <h2 class="subtitulo"> - ${value}</h2>
                `);
            })
        } else {
            Object.keys(Object.values(tabela)[0]).forEach((secoes, i) => {
                $(".containerView").append(`
                    <h2 class="subtitulo"> - ${secoes}</h2>
                `);
                Object.values(Object.values(tabela)[0])[i].forEach(itens => {
                    $(".containerView").append(`
                        <h2 class="subSUBtitulo"> - ${itens}</h2>
                    `);
                })
            })
        }
        console.log()
    }

    function editarTabela(tabela, tabelaId) {
        $(".notificacao").remove();
        notificacao(`
            <section class="notificacao sobrePage">
                <div class="containerView">
                    <a id="closeView" href="#">X</a>
                    <h2 class="titulo">${Object.keys(tabela)[0]}</h2>
                </div>
            </section>
        `);
        if (typeof Object.values(tabela)[0][0] == "string") {
            Object.values(tabela)[0].forEach(value => {
                $(".containerView").append(`
                     <input class="inputItem" type='text' value="${value}" maxlength="35" required>
                `);
            })
        } else {
            Object.keys(Object.values(tabela)[0]).forEach((secoes, i) => {
                $(".containerView").append(`
                    <input class="inputSecao" type='text' value="${secoes}" maxlength="35" required>
                `);
                Object.values(Object.values(tabela)[0])[i].forEach(itens => {
                    $(".containerView").append(`
                        <input class="inputSubiten" type='text' value="${itens}" maxlength="35" required>
                    `);
                })
            })
        }
        $(".containerView").append(`
            <a id="enviarDados" class="enviarDados" href="#">Editar</a>
        `);
    }

    function deletarTabela(delTabela, userId, local) {
        db.collection("usuarios").doc(userId).collection("tabelas").get().then(function (tabelas) {
            tabelas.forEach(tabela => {
                if (Object.keys(tabela.data())[0] == delTabela) {
                    db.collection("usuarios").doc(userId).collection("tabelas").doc(tabela.id).delete().then(function () {
                        $(local).remove();
                        $(".notificacao").fadeOut(500)
                        setTimeout(() => {
                            $(".notificacao").remove()
                        }, 500);
                    }).catch(function (error) {
                        console.error("Error removing document: ", error);
                    });
                }

            });

        }).catch(function (error) {
            console.log(error);
        });
    }

    function notificacao(text) {
        $("body").append(text).fadeIn(500);
    }
});