$(function () {
    $("#menuAdm").click(function (event) {
        event.stopPropagation();
        $("#menuAdm").parent().toggleClass("menuVisivel");
    });

    $("#menuAdm").parent().click(function () {
        $("#menuAdm").parent().removeClass("menuVisivel");
    });

    $("#logOut").click(function () {
        firebase.auth().signOut()
            .then(function () {
                window.location.replace("../html/login.html");
            }, function (error) {
                console.error(error);
            });
    });
});