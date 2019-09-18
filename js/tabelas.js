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
                            <a id="delTrueExcluir" href="#">SIM</a>
                            <a id="delFalseExcluir" href="#">NÃO</a>
                        </span>
                    </div>
                </section>
            `);
        } else if ($(this).text() == "Editar") {
            console.log("Editar");
        } else if ($(this).text() == "Vizualizar") {
            console.log("Vizualizar");
        }
        // console.log($(this).parent().parent().parent().find("h2").text());
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

    $("body").on("click", "#delFalseExcluir", function () {
        $(".notificacao").fadeOut(500).remove();
        notificacao(`
        `)
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

    function vizualizarTabela(tabela) {

    }

    function editarTabela(tabela) {

    }

    function deletarTabela(delTabela, userId, local) {
        db.collection("usuarios").doc(userId).collection("tabelas").get().then(function (tabelas) {
            tabelas.forEach(tabela => {
                if (Object.keys(tabela.data())[0] == delTabela) {
                    db.collection("usuarios").doc(userId).collection("tabelas").doc(tabela.id).delete().then(function () {
                        $(local).remove();
                        $(".notificacao").fadeOut(500).remove()
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