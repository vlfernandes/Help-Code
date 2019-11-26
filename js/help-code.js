$(function () {
    $("#areaTabela").click(function () {
        window.location.href = '../html/novaTabela.html'
    });
    $("#areaProduto").click(function () {
        window.location.href = '../html/novoProduto.html'
    });
    let typeUser = 3;
    if (typeUser == 1) {
        $("#page1").removeClass("typeIsNotUser");
        $("#page2").addClass("typeIsNotUser");
        $("#page3").addClass("typeIsNotUser");
    } else if (typeUser == 2) {
        $("#page1").addClass("typeIsNotUser");
        $("#page2").removeClass("typeIsNotUser");
        $("#page3").addClass("typeIsNotUser");
    } else {
        $("#page1").addClass("typeIsNotUser");
        $("#page2").addClass("typeIsNotUser");
        $("#page3").removeClass("typeIsNotUser");
    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $("h1").text(`Olá, ${user.displayName}`);
        } else {
            window.location.href = ("../html/login.html");
        }
        $(".lds-css").fadeOut("slow");
    });
});