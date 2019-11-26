$(function () {
    var db = firebase.firestore();
    var produtoAtual = "";
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            procurarProdutos(user.uid)
        } else {
            window.location.href = ("../html/login.html");
        }
    });

    $(".addProduto").click(function () {
        window.location.href = ("../html/novoProduto.html");
    });

    function notificacao(text) {
        $("body").append(text).fadeIn(500);
    }

    function procurarProdutos(userId) {
        db.collection("usuarios").doc(userId).collection("produtos").get().then(function (produtos) {

            var qrCode;
            if (produtos.size == 0) {
                $(".lds-css").fadeOut("slow");
            }
            produtos.forEach(produto => {
                db.collection("produtos").get().then(function (pros) {
                    pros.forEach(p => {
                        if (Object.keys(p.data())[0] == userId && Object.values(p.data())[0] == produto.id) {
                            qrCode = p.id
                        }
                    });
                    $(` <div id="produto" class="produto">
                        <h2>${Object.keys(produto.data())}</h2>
                        <div>
                            <span>
                                <img id="delete${produto.id}" src="../img/trash.svg" alt="">
                                <a href="#">Excluir</a>
                            </span>
                            <span>
                                <img id="edit${produto.id}" src="../img/edit.svg" alt="">
                                <a href="#">Editar</a>
                            </span>
                            <span>
                                <img id="view${qrCode}" src="../img/visualizar.svg" alt="">
                                <a href="#">Vizualizar</a>
                            </span>
                            <span>
                                <img id="qr${qrCode}" src="../img/qr-code.svg" alt="">
                                <a href="#">QR code</a>
                            </span>
                        </div>
                    </div>`).insertBefore(".addProduto");
                    $(".lds-css").fadeOut("slow");
                }).catch(function (error) {
                    console.log(error);
                });
            });
        }).catch(function (error) {
            console.log(error);
        });
    }


    $("body").on("click", "a", function () {
        if ($(this).text() == "Excluir") {
            produtoAtual = $(this).parent().parent().parent().find("h2");
            notificacao(`
                <section class="notificacao">
                    <div class="delete">
                        <h2 class="titulo">Deseja excluir o produto ${produtoAtual.text()}?</h2>
                        <span>
                        <a id="delFalseExcluir" href="#">NÃO</a>
                        <a id="delTrueExcluir" href="#">SIM</a>
                        </span>
                    </div>
                </section>
            `);
        } else if ($(this).text() == "Editar") {
            console.log("Editar");
        } else if ($(this).text() == "Vizualizar") {
            let cod = $(this).parent().find("img").attr("id").split("view")[1]
            window.open(`info-produtos.html?${cod}`);
        } else if ($(this).text() == "QR code") {
            let nome = $(this).parent().parent().parent().find("h2").text()
            geraQRCode($(this).parent().find("img").attr("id").split("qr")[1], nome)
        }
    });

    $("body").on("click", "#delTrueExcluir", function () {
        $(".notificacao div").remove();
        $(".notificacao").append(`
            <div id="load"></div>
        `);
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                deletarProduto(produtoAtual.parent().find("div span img").attr("id").split("delete")[1], user.uid, produtoAtual.parent())
            }
        });
    });

    $("body").on("click", "#delFalseExcluir, #fechaqrcode", function () {
        $(".notificacao").fadeOut(500)
        setTimeout(() => {
            $(".notificacao").remove()
        }, 500);
    });

    function deletarProduto(delProduto, userId, local) {
        db.collection("usuarios").doc(userId).collection("produtos").get().then(function (produtos) {
            produtos.forEach(produto => {
                if (produto.id == delProduto) {
                    db.collection("usuarios").doc(userId).collection("produtos").doc(produto.id).delete().then(function () {
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

    function geraQRCode(codProduto, nome) {
        console.log(codProduto)
        notificacao(`
                <section class="notificacao">
                    <div class="delete">
                        <h2 class="titulo tituloQRcode">${nome}</h2>
                        <a id="fechaqrcode" class="fechaqrcode" href="#">X</a>
                        <div class="containerqrCode">
                            <div class="divqrCode">
                                <div id="qrCode"></div>
                            </div>
                            <a id="baixarqrCode" class="baixarqrCode" href="#">Baixe o QR Code</a>
                        </div>
                    </div>
                </section>
            `);
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

    $("body").on("click", "#baixarqrCode", function () {
        var conteudo = document.getElementById('qrCode').innerHTML;
        tela_impressao = window.open('about:blank');

        tela_impressao.document.write(conteudo);
        tela_impressao.window.print();
        tela_impressao.window.close();
    })

});