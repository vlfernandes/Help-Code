$(function () {
    let idSecao = 1;
    $("#addSecao").on("click", function () {
        $("#secao").append("<li><input type='text' name=" + idSecao + " id=" + idSecao + "><ul id='item'><li class='addItem'>+</li></ul></li>");
        idSecao++;
    });
    $("#secao").on("click", ".addItem", function () {
        $(this).parent().append("<li><input type='text' name='0' id='0'></li>");
    });
});