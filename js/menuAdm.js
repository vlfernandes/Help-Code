$(function () {
    $("#menuAdm").click(function (event) {
        event.stopPropagation();
        $("#menuAdm").parent().toggleClass("menuVisivel");
    });

    $("#menuAdm").parent().click(function () {
        $("#menuAdm").parent().removeClass("menuVisivel");
    });
});