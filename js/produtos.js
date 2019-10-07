$(function () {
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            procurarProdutos(user.uid)
        } else {
            window.location.href = ("../html/login.html");
            // $(".lds-css").fadeOut("slow");
        }
    });

    $(".addProduto").click(function () {
        window.location.href = ("../html/novoProduto.html");
    });

    function procurarProdutos(userId) {
        console.log(userId);
        db.collection("usuarios").doc(userId).collection("produtos").get().then(function (produtos) {
            console.log(produtos);
            produtos.forEach(produto => {
                // console.log(typeof (Object.values(tabela.data())[0])[1]); //Usar para diferenciar o array do Objeto
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
                                <img id="view${produto.id}" src="../img/visualizar.svg" alt="">
                                <a href="#">Vizualizar</a>
                            </span>
                        </div>
                    </div>`).insertBefore(".addProduto");
            });
            $(".lds-css").fadeOut("slow");
        }).catch(function (error) {
            console.log(error);
        });
    }

});