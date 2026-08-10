const API_LOGIN = API_URL + "auth/login.php";
const login = new ComponentHelper("#login-form");

$(".form-control").each(function (e) {
    $(this).on("click select2:open", function (event) {
        $(this).removeClass("is-invalid");
    });
});

login.setMandatoryFields([
    { field: "username", name: "Usuario", type: "input" },
    { field: "password", name: "Contraseña", type: "input" },
]);

login.onAction("login", async () => {
    if (!login.validateMandatory()) return;

    try {
        await HttpClient.post(API_LOGIN, login.getData());
        window.location.reload();
    } catch (error) {
        console.log(error.response ?? error);

        Toast.fire({
            icon: "error",
            title: "Ocurrió un error",
            theme: "light",
            html: error.message,
        });
    }
});

login.$context[0].addEventListener("keydown", (e) => { if (e.keyCode == 13) login.getAction("login").click() });