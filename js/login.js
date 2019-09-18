$(function () {
    $(".btn1").click(function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    });


    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.location.href = ("./help-code.html");
        }
        $(".lds-css").fadeOut("slow");
    })
});