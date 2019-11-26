$(function () {
    var db = firebase.firestore();
    var storage = firebase.storage();
    var logo;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            coletarDados(user.uid);
        } else {
            window.location.href = ("../html/login.html");
        }
    });

    function coletarDados(userId) {
        db.collection("usuarios").doc(userId).get().then(function (dados) {
            infos = dados.data()
            if (infos != undefined) {
                alteraDadoInput("#nomeEmpresa", infos.nome)
                alteraDadoInput("#telefoneEmpresa", infos.telefone)
                alteraDadoInput("#emailEmpresa", infos.email)
                alteraDadoInput("#enderecoEmpresa", infos.endereco)
                storage.ref("usuarios/" + userId + "/logo").getDownloadURL().then(function (url) {
                    $("#img").attr("src", url);
                    $("#img").addClass("imgTrocada")
                    $(".lds-css").fadeOut("slow");
                }).catch(function (error) {
                    $("#img").attr("src", "../img/logoEmpresa.svg");
                    $(".lds-css").fadeOut("slow");
                })
            }

            $("#btn1").click(function () {
                $(".lds-css").fadeIn("fast")
                nome = $("#nomeEmpresa").val()
                telefone = $("#telefoneEmpresa").val()
                email = $("#emailEmpresa").val()
                endereco = $("#enderecoEmpresa").val()
                var storageRef = storage.ref();
                setTimeout(() => {
                    if (logo) {
                        storageRef.child('usuarios/' + userId + '/logo').put(logo[0])
                            .then(function (alou) {
                                console.log(alou)
                            });
                    }

                    db.collection("usuarios").doc(userId).set({
                        nome,
                        telefone,
                        email,
                        endereco
                    }, {
                        merge: true
                    }).then(function () {
                        $(".lds-css").fadeOut("slow")
                    }).catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
                }, 500);
            })
        }).catch(function (error) {
            console.log(error);
        });
    }

    function alteraDadoInput(inputId, text) {
        if (text)
            $(inputId).val(text)
    }

    ////////////////////// Busca imagens ///////////////////////////

    $("#btn").click(function () {
        $("#buscar").click();
    });

    $(document).on('change', "#buscar", atualizarImagem); /* Chama o metodo toda vez que seleciona uma imagem nova */

    var tiposDeArquivos = [
        'image/jpeg',
        'image/pjpeg',
        'image/png'
    ]

    function atualizarImagem() {
        logo = $("#buscar").prop("files");
        if (logo.length === 0) {
            /* NÂO ESCOLHEU NENHUMA IMAGEM */
        } else if (!validarTipoArquivo(logo[0])) {
            // TIPO DE ARQUIVO NÃO CORRESPONDENTE
        } else {
            $("#img").attr("src", window.URL.createObjectURL(logo[0]));
            $("#img").addClass("imgTrocada")
        }
    }

    function validarTipoArquivo(arquivo) {
        for (var i = 0; i < tiposDeArquivos.length; i++) {
            if (arquivo.type === tiposDeArquivos[i]) {
                return true;
            }
        }
        return false;
    }
});